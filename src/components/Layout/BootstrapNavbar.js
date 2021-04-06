import React from 'react'


import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
  import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'
  import VOCT from '../Maps/OpenLayersMaps';
  import ToggleSwitch from "react-switch";
  import solace from 'solclientjs'
  import UtilityService from '../service/UtilityService';
//   import ScriptTag from 'react-script-tag';


//   const Demo = props => (
//     <ScriptTag type="text/javascript" src="/path/to/resource.js" />
//     )

  var QueueConsumer = function (solaceModule, queueName) {
    'use strict';
    var solace = solaceModule;
    var consumer = {};
    consumer.session = null;
    consumer.queueName = queueName;
    consumer.consuming = false;
  
    // Logger
    consumer.log = function (line) {
        var now = new Date();
        var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        var timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + line);
    };

    consumer.log('\n*** Consumer to queue "' + consumer.queueName + '" is ready to connect ***');
  
    // main function
    consumer.run = function (argv) {
        consumer.connect(argv);
    };
  
    // Establishes connection to Solace message router
    consumer.connect = function (argv) {
        if (consumer.session !== null) {
            consumer.log('Already connected and ready to consume messages.');
            return;
        }
        // extract params
        // if (argv.length < (2 + 3)) { // expecting 3 real arguments
        //     consumer.log('Cannot connect: expecting all arguments' +
        //         ' <protocol://host[:port]> <client-username>@<message-vpn> <client-password>.\n' +
        //         'Available protocols are ws://, wss://, http://, https://, tcp://, tcps://');
        //     process.exit();
        // }
        var hosturl = "ws://mrd8f4yze1y5d.messaging.solace.cloud:80";
        consumer.log('Connecting to Solace message router using url: ' + hosturl);
       
        // var usernamevpn = argv.slice(3)[0];
        // var username = usernamevpn.split('@')[0];
        var username = "solace-cloud-client";
        consumer.log('Client username: ' + username);
        // var vpn = usernamevpn.split('@')[1];
        var vpn = "tech_poc";
        consumer.log('Solace message router VPN name: ' + vpn);
        // var pass = argv.slice(4)[0];
        var pass = "c48q8hbijrqjg26agrlma7oce4";
        // create session
        try {
            consumer.session = solace.SolclientFactory.createSession({
                // solace.SessionProperties
                url:      hosturl,
                vpnName:  vpn,
                userName: username,
                password: pass,
            });
        } catch (error) {
            consumer.log(error.toString());
        }
        // define session event listeners
        consumer.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            consumer.log('=== Successfully connected and ready to start the message consumer. ===');
            // alert("Successfully connected and ready to start the message consumer")
            consumer.startConsume();
        });
        consumer.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
            consumer.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        consumer.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
            consumer.log('Disconnected.');
            consumer.consuming = false;
            if (consumer.session !== null) {
                consumer.session.dispose();
                consumer.session = null;
            }
        });
        // connect the session
        try {
            consumer.session.connect();
        } catch (error) {
            consumer.log(error.toString());
        }
    };
  
    // Starts consuming from a queue on Solace message router
    consumer.startConsume = function () {
        if (consumer.session !== null) {
            if (consumer.consuming) {
                consumer.log('Already started consumer for queue "' + consumer.queueName +
                    '" and ready to receive messages.');
            } else {
                consumer.log('Starting consumer for queue: ' + consumer.queueName);
                try {
                    // Create a message consumer
                    consumer.messageConsumer = consumer.session.createMessageConsumer({
                        // solace.MessageConsumerProperties
                        queueDescriptor: { name: consumer.queueName, type: solace.QueueType.QUEUE },
                        acknowledgeMode: solace.MessageConsumerAcknowledgeMode.CLIENT, // Enabling Client ack
                    });
                    // Define message consumer event listeners
                    consumer.messageConsumer.on(solace.MessageConsumerEventName.UP, function () {
                        consumer.consuming = true;
                        consumer.log('=== Ready to receive messages. ===');
                    });
                    consumer.messageConsumer.on(solace.MessageConsumerEventName.CONNECT_FAILED_ERROR, function () {
                        consumer.consuming = false;
                        consumer.log('=== Error: the message consumer could not bind to queue "' + consumer.queueName +
                            '" ===\n   Ensure this queue exists on the message router vpn');
                    });
                    consumer.messageConsumer.on(solace.MessageConsumerEventName.DOWN, function () {
                        consumer.consuming = false;
                        consumer.log('=== The message consumer is now down ===');
                    });
                    consumer.messageConsumer.on(solace.MessageConsumerEventName.DOWN_ERROR, function () {
                        consumer.consuming = false;
                        consumer.log('=== An error happened, the message consumer is down ===');
                    });
                    // Define message received event listener
                    consumer.messageConsumer.on(solace.MessageConsumerEventName.MESSAGE, function (message) {
                        // consumer.log('Received message: "' + message.getBinaryAttachment() + '",' +
                        //     ' details:\n' + message.getDestination());

                        
                        var dataJsonStr = message.getDestination();
                        let utilObject = new UtilityService();
                        utilObject.pushToMapStore(dataJsonStr);
                        // Need to explicitly ack otherwise it will not be deleted from the message router
                        //consumer.log("Test1: " + dataJsonStr.split("/"));
                        //var parsedObj = JSON.parse(dataJsonStr);
                        //alert(parsedObj);
                        message.acknowledge();
                    });
                    // Connect the message consumer
                    consumer.messageConsumer.connect();
                } catch (error) {
                    consumer.log(error.toString());
                }
            }
        } else {
            consumer.log('Cannot start the queue consumer because not connected to Solace message router.');
        }
    };
  
    consumer.exit = function () {
        consumer.stopConsume();
        consumer.disconnect();
        setTimeout(function () {
            process.exit();
        }, 1000); // wait for 1 second to finish
    };
  
    // Disconnects the consumer from queue on Solace message router
    consumer.stopConsume = function () {
        if (consumer.session !== null) {
            if (consumer.consuming) {
                consumer.consuming = false;
                consumer.log('Disconnecting consumption from queue: ' + consumer.queueName);
                try {
                    consumer.messageConsumer.disconnect();
                    consumer.messageConsumer.dispose();
                } catch (error) {
                    consumer.log(error.toString());
                }
            } else {
                consumer.log('Cannot disconnect the consumer because it is not connected to queue "' +
                    consumer.queueName + '"');
            }
        } else {
            consumer.log('Cannot disconnect the consumer because not connected to Solace message router.');
        }
    };
  
    // Gracefully disconnects from Solace message router
    consumer.disconnect = function () {
        consumer.log('Disconnecting from Solace message router...');
        if (consumer.session !== null) {
            try {
                consumer.session.disconnect();
            } catch (error) {
                consumer.log(error.toString());
            }
        } else {
            consumer.log('Not connected to Solace message router.');
        }
    };
  
    return consumer;
  };

class BootstrapNavbar extends React.Component{

    
    constructor() {
        
        super();
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
        this.consumer = new QueueConsumer(solace, 'Q_VOCT');

      }
      
      handleChange(checked) {
        this.setState({ checked });
       

        //var solace = require('solclientjs').debug; // logging supported
        var factoryProps = new solace.SolclientFactoryProperties();
        factoryProps.profile = solace.SolclientFactoryProfiles.version10;
        solace.SolclientFactory.init(factoryProps);
        // enable logging to JavaScript console at WARN level
        // NOTICE: works only with ('solclientjs').debug
        solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);
      
        // create the consumer, specifying the name of the queue
        
        
        if (this.consumer.session !== null) {
            
            this.consumer.log('Closing Connections');
            this.consumer.disconnect = function () {
                this.consumer.log('Disconnecting from Solace message router...');
                if (this.consumer.session !== null) {
                    try {
                        this.consumer.session.disconnect();
                    } catch (error) {
                        this.consumer.log(error.toString());
                    }
                } else {
                    this.consumer.log('Not connected to Solace message router.');
                }
            };
        }else{
            this.consumer.run(process.argv);
        }
       // alert(consumer.session)
        // subscribe to messages on Solace message router

        
    //     this.consumer.log("Press Ctrl-C to exit");
    //     //process.stdin.resume();
      
    //     process.on('SIGINT', function () {
    //       'use strict';
    //       this.consumer.exit();
    //   });
      }
    

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Router>
                            <Navbar bg="dark" variant="dark" expand="lg" sticky="top" expand="sm">
                                <Navbar.Brand href="#home">Solace</Navbar.Brand> 
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="mr-auto">
                                    <ToggleSwitch onChange={this.handleChange} checked={this.state.checked} />
                                    {/* <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="/about-us">Contact Us</Nav.Link>
                                    <Nav.Link href="/contact-us">About Us</Nav.Link> */}
                                    {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                    </NavDropdown> */}
                                    </Nav>
                                    <Form inline>
                                    {/* <FormControl type="text" placeholder="S11earch" className="mr-sm-2" /> */}
                                    {/* <Button variant="outline-success">Search</Button> */}
                                    </Form>
                                </Navbar.Collapse>
                            </Navbar>
                            <br />
                            <Switch>
                                <Route exact path="/">
                                    <VOCT />
                                </Route>
                                {/* <Route path="/about-us">
                                    <AboutUs />
                                </Route>
                                <Route path="/contact-us">
                                    <ContactUs />
                                </Route> */}
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        )  
    }
}

export default BootstrapNavbar;