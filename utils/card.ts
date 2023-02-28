export async function createCardOfResult(result: string): Promise<Blob> {
  const imageWidth = 400;
  const imageHeight = 400;
  const padding = 20;
  const cleanString = result.replace("\n", "").trim();

  var canvas = document.createElement("canvas");

  canvas.id = "CursorLayer";
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  // canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";

  //   const canvas = new OffscreenCanvas(imageWidth, imageHeight);
  const ctx = canvas.getContext("2d");

  const bgGradient = ctx.createLinearGradient(0, 0, 0, imageHeight);
  bgGradient.addColorStop(0, "#121A35");
  bgGradient.addColorStop(1, "#0C1122");

  ctx.strokeStyle = bgGradient;
  ctx.fillStyle = bgGradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, imageWidth, imageHeight, 20);
  ctx.fill();
  ctx.stroke();

  const font = "Rubik";
  let fontSize = 20;

  ctx.font = `${fontSize}px "${font}"`;
  const {
    // actualBoundingBoxLeft,
    // actualBoundingBoxRight,
    // actualBoundingBoxAscent,
    // actualBoundingBoxDescent,
    width,
  } = ctx.measureText(result);

  //   canvas.height = actualBoundingBoxAscent + actualBoundingBoxDescent;
  const fontHeight = 30;
  let textSegments = [];

  if (width > imageWidth) {
    const maxTextAllowedWidth = imageWidth - padding * 2;
    const words = cleanString.split(" ");

    console.log(words.length);

    if (words.length > 30) {
      fontSize = 18;
    }
    if (words.length > 50) {
      fontSize = 16;
    }
    if (words.length > 90) {
      fontSize = 14;
    }
    ctx.font = `${fontSize}px "${font}"`;

    let curLine = [];
    words.forEach((n, indx) => {
      // Add every word to a LINE
      curLine.push(n);
      // Then check that LINEs width
      const { width } = ctx.measureText(curLine.join(" "));

      // If the LINE is too long for the image width
      // Remove the last word, add that LINE to our lines array
      // and create a new LINE starting with our most recent word
      if (width > maxTextAllowedWidth) {
        curLine.pop();
        textSegments.push(curLine);
        curLine = [n];
      }

      // If you've run out of words - submit whatever LINE you're on
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
  ctx.fillStyle = "white";
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

  //   const img = new Image(200, 200);

  const blob = await fetch("fmyfriends-tag.png").then((r) => r.blob());
  const imgBitmap = await createImageBitmap(blob);
  ctx.drawImage(
    imgBitmap,
    padding,
    imageHeight - padding - 50,
    imageWidth / 2,
    50
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((n: Blob) => resolve(n));
  });
}
