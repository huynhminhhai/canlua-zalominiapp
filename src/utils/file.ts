import images from "assets/images";
import envConfig from "envConfig";

export const convertBlobUrlToFile = async (blobUrl: string, fileName: string): Promise<File> => {
  const response = await fetch(blobUrl); // Tải blob từ Blob URL
  const blob = await response.blob(); // Chuyển response thành Blob
  const file = new File([blob], fileName, { type: blob.type }); // Tạo File từ Blob
  return file;
};

export const getFullImageUrl = (anhDaiDien: string) => {
  if (!anhDaiDien) return images.thumbnailNews; // Nếu không có ảnh, trả về chuỗi rỗng
  if (anhDaiDien.startsWith("http") || anhDaiDien.startsWith("https")) return anhDaiDien; // Nếu đã có domain, giữ nguyên
  return `${envConfig.API_ENDPOINT}${anhDaiDien}`; // Thêm domain nếu thiếu
};


// export const convertToFormData = (data: Record<string, any>) => {
//   const formData = new FormData();

//   Object.keys(data).forEach((key) => {
//     const value = data[key];

//     if (value === undefined || value === null) return;

//     if (value instanceof File) {
//       // Trường hợp là File đơn lẻ
//       formData.append(key, value);
//     } else if (Array.isArray(value)) {
//       // Trường hợp là mảng
//       if (value.length > 0 && value.every((item) => item instanceof File)) {
//         // Nếu là mảng File[], append từng file với key không có index
//         value.forEach((file: File) => {
//           formData.append(key, file);
//         });
//       } else {
//         // Nếu là mảng các giá trị khác (string, number, ...)
//         value.forEach((item) => {
//           formData.append(key, item.toString());
//         });
//       }
//     } else {
//       // Trường hợp là giá trị đơn (string, number, ...)
//       formData.append(key, value.toString());
//     }
//   });

//   return formData;
// };

export const convertToFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === undefined || value === null) return;

    if (value instanceof File) {
      // Trường hợp là File đơn lẻ
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else if (typeof item === "object") {
          // Nếu item là object → stringify
          formData.append(key, JSON.stringify(item));
        } else {
          formData.append(key, item.toString());
        }
      });
    } else if (typeof value === "object") {
      // Trường hợp là object đơn lẻ
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value.toString());
    }
  });

  return formData;
};


export const loadImage = async (url: string): Promise<File | null> => {
  try {
    const cleanUrl = url.startsWith("/uploads") ? url.replace("/uploads", "") : url;

    const response = await fetch(`${envConfig.API_ENDPOINT}${cleanUrl}`);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();
    return new File([blob], "uploaded-image.jpg", { type: blob.type });
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

type FileInput = {
  tapTin: string;
  tenTapTin: string;
};

export const loadFile = async ({ tapTin, tenTapTin }: FileInput): Promise<File | null> => {
  try {
    const cleanUrl = tapTin.startsWith("/uploads") ? tapTin.replace("/uploads", "") : tapTin;

    const response = await fetch(`${envConfig.API_ENDPOINT}${cleanUrl}`);
    if (!response.ok) throw new Error(`Failed to fetch file: ${tenTapTin}`);

    const blob = await response.blob();
    const contentType = blob.type || "application/octet-stream";

    return new File([blob], tenTapTin, { type: contentType });
  } catch (error) {
    console.error("Error loading file:", tenTapTin, error);
    return null;
  }
};

export const isImage = (fileName: string) => {
  return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(fileName);
};

export const isVideo = (fileName: string) => {
  return /\.(mp4|webm|ogg|avi|mov|wmv|mkv)$/i.test(fileName);
};

export const isPDF = (fileName: string) => {
  return /\.pdf$/i.test(fileName);
};

export const base64ToBlob = (base64: string, mimeType = 'application/octet-stream'): Blob => {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteArrays: Uint8Array[] = []; // 👈 Khai báo rõ ràng

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray); // ✅ không lỗi nữa
  }

  return new Blob(byteArrays, { type: mimeType });
};