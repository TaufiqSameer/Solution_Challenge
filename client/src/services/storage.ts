import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase"

export async function uploadReport(
  file: File,
  userId: string
): Promise<string> {
  const fileRef = ref(
    storage,
    `reports/${userId}/${Date.now()}_${file.name}`
  )
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  return url
}