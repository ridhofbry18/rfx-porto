import { CLOUDINARY_CLOUD, CLOUDINARY_PRESET, CLOUDINARY_PRESET_VIDEO } from './constants';

export const uploadFotoCloudinary = (file, onProgress) => new Promise((resolve, reject) => {
  if (!file) return reject('Tidak ada file');
  if (file.size > 5 * 1024 * 1024) return reject('File foto melebihi batas 5MB');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const xhr = new XMLHttpRequest();
  xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
  xhr.onload = () => {
    const res = JSON.parse(xhr.responseText);
    if (xhr.status === 200) resolve(res.secure_url);
    else reject(res.error?.message || 'Upload gagal');
  };
  xhr.onerror = () => reject('Network error');
  xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`);
  xhr.send(fd);
});

export const uploadVideoCloudinary = (file, onProgress) => new Promise((resolve, reject) => {
  if (!file) return reject('Tidak ada file');
  if (file.size > 200 * 1024 * 1024) return reject('File video melebihi batas 200MB');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET_VIDEO || CLOUDINARY_PRESET);
  const xhr = new XMLHttpRequest();
  xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
  xhr.onload = () => {
    const res = JSON.parse(xhr.responseText);
    if (xhr.status === 200) resolve(res.secure_url);
    else reject(res.error?.message || 'Upload gagal');
  };
  xhr.onerror = () => reject('Network error');
  xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/video/upload`);
  xhr.send(fd);
});
