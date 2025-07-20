// components/GeneratePdfButton.tsx
"use client";

export default function GeneratePdfButton({
  documentId,
  jwt,
  classes,
}: {
  documentId: string;
  jwt: string;
  classes: string;
}) {
  const handleClick = async () => {
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
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `petition-${documentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleClick} className={classes}>
      Generate PDF
    </button>
  );
}
