import { useState } from "react";
import { supabase } from "../../shared/utils/supabase";

export type uploadDataType = {
  success: boolean;
  name: string;
  url: string;
  error?: string;
};

export function useUpload() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadsData, setUploadsData] = useState<uploadDataType[]>([]);
   
  const upload = async (files: File[], bucketName: string) => {
    try {
      setIsUploading(true);

      const uploadsDataResults = await Promise.allSettled(
        files.map((file) => {
          const uniquePath = `${Date.now()}-${crypto.randomUUID()}`;
          return supabase.storage.from(bucketName).upload(uniquePath, file);
        }),
      );

      const formattedUploads = uploadsDataResults.map((result, index) => {
        const originalFile = files[index];

        if (result.status === "fulfilled") {
          const { data, error: supabaseError } = result.value;

          if (supabaseError) {
            console.error(
              `Upload failed for ${originalFile.name}: [${supabaseError.status}] ${supabaseError.message}`,
            );
            return {
              success: false,
              name: originalFile.name,
              url: "",
              error: supabaseError.message,
            };
          }

          // SUCCESS: Generate the public URL synchronously using the returned path
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

          return {
            success: true,
            name: originalFile.name,
            url: publicUrlData.publicUrl,
          };
        }

        // Case B: Promise Rejected (Total network drop or browser block)
        console.error(
          `Critical network error for ${originalFile.name}:`,
          result.reason,
        );
        return {
          success: false,
          name: originalFile.name,
          url: "",
          error: result.reason?.message || "Network error",
        };
      });

      setUploadsData(formattedUploads);
    } catch (err) {
      console.error("Unexpected Error occured: ", err);
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, uploadsData };
}
