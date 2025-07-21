"use client";
import Link from "next/link";
import { useState } from "react";
export default function GeneratePdfButton({
  documentId,
  jwt,
  classes,
}: {
  documentId: string;
  jwt: string;
  classes: string;
}) {
  const init = {
    loading: false,
    error: false,
    success: false,
    errMessage: "",
    sucMessage: "",
  };
  const initDownload = { href: "", file: "" };
  const [genPDF, setGenPDF] = useState(init);
  const [download, setDownload] = useState(initDownload);

  const createDownload = async (response: any) => {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    setDownload((prev) => ({
      ...prev,
      file: `${process.env.NEXT_PUBLIC_STRAPI_API}/pdfs/petition-${documentId}.pdf`,
      href: url,
    }));
  };

  const handleClick = async () => {
    setGenPDF({ ...init, loading: true });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API}/user-petitions/${documentId}/generate-pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (response.ok) {
        setGenPDF({ ...init, success: true, sucMessage: "PDF Generated!" });
        createDownload(response);
      } else {
        setGenPDF({ ...init, error: true, errMessage: "Server Error" });
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      setGenPDF({
        ...init,
        error: true,
        errMessage: "Failed to Connect to Server",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`${classes} ${genPDF.loading && "bg-gray-200"} font-sans mb-5`}
      >
        {genPDF.loading ? "Processing ..." : "Generate PDF"}
      </button>
      {genPDF.error && <p className="text-red-500">{genPDF.errMessage}</p>}
      {genPDF.success && (
        <>
          <p>{genPDF.sucMessage} You can now download your petition: </p>
          <Link
            rel="noopener noreferrer"
            download={download.file}
            href={download.href}
            id="pdf"
            className={`!text-blue-500 ${genPDF.loading && "bg-gray-200"} font-sans`}
          >
            {genPDF.loading ? "Processing ..." : "Download PDF"}
          </Link>
        </>
      )}
    </div>
  );
}
