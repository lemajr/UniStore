import React from "react";
import Sort from "@/components/Sort";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });
  
   // Fetch total space used
   const totalSpace = await getTotalSpaceUsed();
  
   console.log("Type:", type);
   console.log("Total Space Data:", totalSpace);


    // Calculate total size for the specific type or all files
  let totalForType = 0;

  if (types && types.length > 0) {
    // If types is an array, sum up the sizes of all specified types
    totalForType = types.reduce((acc, currentType) => {
      return acc + (totalSpace[currentType]?.size || 0);
    }, 0);
  } else {
    // If type is not specified or not valid, use the total space used
    totalForType = totalSpace.used;
  }

  const formattedSize = (totalForType / (1024 * 1024)).toFixed(2);


  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5"> {formattedSize} MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
