import ImageKit from "imagekit";

async function uploadToImageKit(file: any, fileName: string) {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  try {
    const result = await imagekit.upload({
      file,
      fileName,
      folder: `avatars`,
    });

    console.log("image upload :>> ", result);
    return result.url;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload image");
  }
}

export default uploadToImageKit;
