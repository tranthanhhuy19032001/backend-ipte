export const normalizeUrl = (url: string): string => {
  if (!url) return "";

  // Tách protocol ra để không làm hỏng "https://"
  const match = url.match(/^(https?:\/\/)(.+)$/);
  
  if (!match) {
    // Không có protocol → xử lý bình thường
    return url
      .replace(/\/{2,}/g, "/")   // thay nhiều slashes bằng 1
      .replace(/\/+$/, "");      // xoá dấu / cuối
  }

  const protocol = match[1]; // https://
  const rest = match[2];     // phần còn lại

  const normalizedRest = rest
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "");

  return protocol + normalizedRest;
};
