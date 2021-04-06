function loadData(message){

    var payload = message.getBinaryAttachment();
        var payloadTxt = message.getXmlContent();
      var topic_string = message.getDestination().getName();

      if (payload == null) payload = payloadTxt;

    this.paintData (topic_string, payload);
}

