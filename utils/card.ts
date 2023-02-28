export async function createCardOfResult(result: string) {
  const imageWidth = 400;
  const padding = 20;
  const cleanString = result.replace("\n", "").trim();

  const canvas = new OffscreenCanvas(imageWidth, 400);
  const ctx = canvas.getContext("2d");

  const font = "Rubik";
  const fontSize = 20;

  ctx.font = `${fontSize}px "${font}"`;
  const {
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
    width,
  } = ctx.measureText(result);

  //   canvas.height = actualBoundingBoxAscent + actualBoundingBoxDescent;
  const fontHeight = 30;
  let textSegments = [];

  if (width > imageWidth) {
    const maxFontAllowedWidth = imageWidth - padding * 2;
    const words = cleanString.split(" ");

    let curLine = [];
    words.forEach((n, indx) => {
      curLine.push(n);
      const { width } = ctx.measureText(curLine.join(" "));

      if (width > maxFontAllowedWidth) {
        curLine.pop();
        textSegments.push(curLine);
        curLine = [n];
      }

      if (indx == words.length - 1) {
        textSegments.push(curLine);
      }
    });
  } else {
    textSegments = [cleanString];
  }

  // Take the larger of the width and the horizontal bounding box
  // dimensions to try to prevent cropping of the text.
  //   canvas.width = Math.max(
  //     width,
  //     Math.abs(actualBoundingBoxLeft) + actualBoundingBoxRight
  //   );

  // Set the font again, since otherwise, it's not correctly set when filling.
  ctx.font = `${fontSize}px ${font}`;
  ctx.textBaseline = "top";
  //   ctx.fillText(result, padding, padding, imageWidth - padding * 2);

  textSegments.forEach((n, indx) => {
    ctx.fillText(
      n.join(" "),
      padding,
      padding + indx * fontHeight,
      imageWidth - padding * 2
    );
  });

  return await canvas.convertToBlob();
}
