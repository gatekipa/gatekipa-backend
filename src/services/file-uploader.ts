import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadToImageKit(file: any, fileName: string) {
  const result = await imagekit.upload({
    file: file.buffer,
    fileName,
  });

  return result;
}

export default uploadToImageKit;
