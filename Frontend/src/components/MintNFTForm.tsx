import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import { NFTContext } from "../contracts/DeVahanContext";

interface MintNFTFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const MintNFTForm: React.FC<MintNFTFormProps> = ({ isOpen, onClose }) => {
  const nftContext = useContext(NFTContext);
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [formData, setFormData] = useState({
    _owner: "",
    _vin: "",
    _make: "",
    _model: "",
    _year: new Date().getFullYear(),
    _purchasePrice: 0,
    _initialMileage: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);


  if (!isOpen) return null;
  if (!nftContext) return <div className="text-white">Error: NFT Context not available.</div>;

  const { mint } = nftContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  // ✅ Upload file to backend -> 0G Storage
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    console.log(file);
    formData.append("file", file);
    console.log('hi')
    const res = await fetch("https://og-devahan-1.onrender.com/api/uploadFile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Image upload failed");

    // Return the rootHash (0G Storage hash)
    return data.rootHash;
  };

  // ✅ Upload JSON metadata to backend -> 0G Storage
  const uploadMetadata = async (jsonData: any): Promise<string> => {
    const res = await fetch("https://og-devahan-1.onrender.com/api/uploadJSON", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Metadata upload failed");

    return data.rootHash;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a vehicle image before minting.");
      return;
    }
    console.log(imageFile)
    console.log('checkpoint 1')
    const formData1 = new FormData();
    formData1.append("file",imageFile);
    formData1.append("upload_preset", "NFT_Marketplace");
    console.log(formData1);
    try {
      setFormState("loading");
    console.log('checkpoint 2')
      // 1️⃣ Upload image to 0G
      const imageRootHash = await uploadImage(imageFile);
          console.log('checkpoint 3')
      console.log("✅ Image uploaded:", imageRootHash);

      const res1 = await fetch(`https://api.cloudinary.com/v1_1/dbvezos5j/image/upload`,{
        method: "POST",
        body: formData1
      });
     const data1 = await res1.json(); // ✅ Parse the JSON response
    const MediaURL = data1.secure_url as string;
      console.log(MediaURL)
      // 2️⃣ Create metadata JSON with imageRootHash
      const metadata = {
        owner: formData._owner,
        vin: formData._vin,
        make: formData._make,
        model: formData._model,
        year: formData._year,
        purchasePrice: formData._purchasePrice,
        initialMileage: formData._initialMileage,
        imageRootHash,
        MediaURL,
        createdAt: new Date().toISOString(),
      };
    console.log('checkpoint 4')
      // 3️⃣ Upload metadata JSON to 0G
      const metadataRootHash = await uploadMetadata(metadata);
      console.log("✅ Metadata uploaded:", metadataRootHash);

const ipfsResponse = await fetch('https://og-devahan-1.onrender.com/api/IPFS', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData._make,
    description: formData._model,
    image: MediaURL,
  }),
});
console.log(ipfsResponse)
const data = await ipfsResponse.json();
console.log(data);
const uri = data.tokenUri;

if (!uri) {
  throw new Error("Failed to get Token URI from server.");
}

console.log("Received Token URI from backend:", uri);



      // 4️⃣ Mint NFT with metadata root hash
      const txHash = await mint(formData._owner,uri, metadataRootHash);
      console.log("✅ NFT minted successfully:", txHash);

      setFormState("success");
      setTimeout(() => {
        setFormState("idle");
        onClose();
      }, 3000);
    } catch (err) {
      console.error("❌ Minting failed:", err);
      alert("Minting failed. Check console for details.");
      setFormState("idle");
    }
  };

  return (
    <div className="absolute overflow-y-scroll inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-primary-light top-20 rounded-lg p-6 w-full max-w-md relative border border-metallic/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-metallic hover:text-white disabled:opacity-50"
          disabled={formState === "loading"}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gold">Mint Vehicle NFT</h2>
          <p className="text-metallic">Upload details & mint ownership certificate</p>
        </div>

        {formState === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {["_owner", "_vin", "_make", "_model", "_year", "_purchasePrice", "_initialMileage"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-metallic mb-1">
                  {field.replace("_", "").toUpperCase()}
                </label>
                <input
                  type={field.includes("_year") || field.includes("Price") || field.includes("Mileage") ? "number" : "text"}
                  name={field}
                  required
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white"
                  placeholder={field.replace("_", "")}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Vehicle Image</label>
              <input
                type="file"
                name="image"
                required
                onChange={handleFileChange}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-primary hover:file:bg-gold/90"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-green text-primary font-bold hover:opacity-90 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Mint Now
            </button>
          </form>
        )}

        {formState === "loading" && (
          <div className="text-center text-white animate-pulse">
            Uploading to 0G & minting NFT... please wait.
          </div>
        )}
        {formState === "success" && (
          <div className="text-center text-green-400">✅ NFT minted successfully!</div>
        )}
      </div>
    </div>
  );
};

export default MintNFTForm;
