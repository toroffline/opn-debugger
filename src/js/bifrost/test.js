function transform(proxyRes) {
  const body = JSON.parse(proxyRes.getResultResponseBodyAsString());
  const newBody = {};
  newBody.data =
    body.eDataTable && body.eDataTable.length ? body.eDataTable : null;
  if (!!body.eMessages && body.eMessages.length > 0) {
    newBody.messageList = body.eMessages
      .filter((message) => {
        return message.item.startsWith("E");
      })
      .map((item) => {
        const itemDescription = item.item.substring(
          item.item.indexOf("E ") + 2
        );
        const formattedItemDescription = itemDescription.replace(" ", "");
        return { info: formattedItemDescription };
      });
    newBody.messageList.forEach((i) => {
      newBody.error = newBody.error ? newBody.error + "," + i.info : i.info;
    });
    if (body.eSuccess) {
      newBody.status = "I4001";
    } else {
      newBody.status = "E4003";
    }
    if (!!newBody.error) {
      let position = newBody.error.search("Duplicate");
      if (position != -1) {
        newBody.status = "E4010";
      }
    }
  } else {
    newBody.status = "E4003";
    newBody.messageList = [{ info: "No Response from SAP" }];
  }
  proxyRes.setResultResponseBodyString(JSON.stringify(newBody));
}
