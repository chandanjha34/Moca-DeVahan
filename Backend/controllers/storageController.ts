// // app/api/og/upload/route.ts
// import { uploadFile, uploadJSON } from "../../Frontend/src/utils/zeroGStorage";
// import { writeFile, unlink } from "fs/promises";
// import path from "path";
// import { randomUUID } from "crypto";

// export const uploadData= async(req:Request)=> {
//   try {
//     const contentType = req.headers.get("content-type") ?? "";
//     if (contentType.includes("application/json")) {
//       const meta = await req.json();
//       const res = await uploadJSON(meta); // ensure it returns { rootHash, txHash }
//       if (!res.rootHash) throw new Error("metadata upload failed");
//       return NextResponse.json({ success: true, metadataHash: res.rootHash });
//     }

//     // multipart/form-data for file
//     const form = await req.formData();
//     const file = form.get("file") as File | null;
//     if (!file) return NextResponse.json({ success: false, error: "no file" }, { status: 400 });

//     const bytes = Buffer.from(await file.arrayBuffer());
//     const tmpDir = path.join(process.cwd(), "tmp0g");
//     const filename = `${randomUUID()}_${file.name || "upload.bin"}`;
//     const tmpPath = path.join(tmpDir, filename);

//     await writeFile(tmpPath, bytes);
//     const resUp = await uploadFile(tmpPath);
//     await unlink(tmpPath);

//     if (!resUp.rootHash) throw new Error("image upload failed");
//     return NextResponse.json({ success: true, imageHash: resUp.rootHash });
//   } catch (e: any) {
//     return NextResponse.json({ success: false, error: e.message ?? "upload error" }, { status: 500 });
//   }
// }
