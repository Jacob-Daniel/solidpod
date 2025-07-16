"use client";

//// todo:
// if user logged in form fields
// on sign complete redirect, or show success res, remove form
import { useRouter } from "next/navigation";
import { useState, useRef, ReactNode } from "react";
import { createPetitionAction } from "@/lib/actions";
import {
  validateInput,
  humanValidator,
  toSlug,
  convertTiptapToStrapi,
} from "@/lib/clientFunctions";
import { uploadImage } from "@/lib/functions";
import RichTextEditor from "@/app/components/RichTextEditor";

import {
  FormSection,
  Member,
  Petition,
  SelectOption,
  SelectField,
  FormFields,
  Media,
  User,
  FileUploadResponse,
  UploadPetition,
} from "@/lib/types";
import { RichTextContent } from "@/lib/userTypes";

type Props = {
  children: ReactNode;
};
let r = (Math.random() + 1).toString(36).substring(7);

export default function PetitionForm({
  section,
  className,

  user,
}: {
  section: FormSection;
  className: string;
  user: User;
}) {
  const router = useRouter();
  const { form_field } = section;
  const formRef = useRef<HTMLFormElement>(null);
  const [count, setCount] = useState(0);
  const [humanError, setHumanError] = useState(false);
  const [message, setMessage] = useState("");
  const [richTextFields, setRichTextFields] = useState<Record<string, any>>({});
  const [richTextData, setRichTextData] = useState<Record<string, any>>({});

  const initValues = (form_field as unknown as { name: string }[]).reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {} as Record<string, string>,
  );

  const [state, setState] = useState(initValues);
  const [boolean, setBoolean] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messageSend, setMessageSend] = useState({
    errorMessage: "",
    successMessage: "",
  });

  const [errors, setErrors] = useState<{
    [key in keyof UploadPetition]: boolean | string | "";
  }>({
    title: "",
    demand: "",
    reason: "",
    image: "",
    end_date: "",
    targetCount: "",
    tags: "",
    target: "",
    ward: "",
    borough: "",
  });

  const triggerCreatePetition = async ({ data }: { data: UploadPetition }) => {
    try {
      const res = await createPetitionAction(data);
      console.log(res, "res create P");
      if (res && "error" in res && res.error) {
        setMessageSend((prev) => ({
          ...prev,
          errorMessage: res?.error?.message as string,
          successMessage: "",
        }));
      } else if (res && "title" in res) {
        setMessageSend((prev) => ({
          ...prev,
          errorMessage: "",
          successMessage:
            `Success: ${res.title} new petition created!` as string,
        }));

        // Redirect to success page with query params
        const queryParams = new URLSearchParams({
          title: res.title || "",
          page_url: window.location.href,
        }).toString();

        router.push(`/new-petition/success?${queryParams}`);
      }
    } catch (error) {
      console.log("Error creating petition:", error);
      setMessageSend((prev) => ({
        ...prev,
        errorMessage: "An unexpected error occurred. Please try again later.",
      }));
    } finally {
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const el = formRef.current?.elements.namedItem("human");
    const human =
      el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
        ? el.value
        : null;

    const passed = await humanValidator({
      human,
      count,
      setCount,
      setHumanError,
      setMessage,
      formRef,
      r,
    }).then();

    if (passed && passed === true) {
      setProcessing(true);

      const newErrors: {
        [key in keyof UploadPetition]: string | boolean | "";
      } = {
        title: "",
        demand: "",
        reason: "",
        image: "",
        end_date: "",
        targetCount: "",
        tags: "",
        target: "",
        ward: "",
        borough: "",
      };

      const formData = new FormData(formRef.current);

      const fieldsToValidate: Array<
        "title" | "demand" | "reason" | "ward" | "target" | "image"
      > = ["title", "demand", "reason", "ward", "target", "image"];

      const imageFile = (
        formRef.current.elements.namedItem("image") as HTMLInputElement
      )?.files?.[0];

      let uploadedFile: FileUploadResponse | null = null;
      if (imageFile) {
        uploadedFile = await uploadImage<FileUploadResponse>(
          imageFile,
          user.jwt,
        );
        if (!uploadedFile) {
          setMessageSend({
            errorMessage: "Image upload failed",
            successMessage: "",
          });
          return;
        }
      }

      const data: UploadPetition = {
        title: formData.get("title") as string,
        demand: convertTiptapToStrapi(
          JSON.parse(formData.get("demand") as string),
        ),
        reason: convertTiptapToStrapi(
          JSON.parse(formData.get("reason") as string),
        ),
        targetCount: Number(formData.get("target_count")),
        target: formData.get("target") as string,
        slug: toSlug(formData.get("title") as string) as string,
        end_date: formData.get("end_date") as string,
        image: uploadedFile?.id || 0,
      };
      // for (const field of fieldsToValidate) {
      //   const errorMessage = validateInput(field, data[field] as string);
      //   newErrors[field] = errorMessage || "";
      // }

      // data.slug = toSlug(data.title);
      if (user.documentId) {
        data.createdByUser = user.documentId as string;
      }

      const hasErrors = Object.values(newErrors).some((error) => error !== "");

      if (!hasErrors) {
        await triggerCreatePetition({ data });

        // formRef.current?.reset();
      } else {
        setErrors(newErrors);
        console.log("Validation errors:", newErrors);
      }

      setProcessing(false);
    }
  };
  const handleRichTextChange = (fieldName: string, value: any) => {
    setRichTextData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <section
      className="col-span-12"
      style={{ backgroundColor: section.bg_colour }}
    >
      {section.heading && (
        <h2 className="text-2xl mb-3 font-bold font-sans capitalize">
          {section.heading}
        </h2>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 ${className} bg-white`}
      >
        {section.form_field &&
          section.form_field instanceof Array &&
          section.form_field.map((field: FormFields, index: number) => (
            <div key={index} className="mb-3">
              {field.type !== "hidden" && (
                <label className="text-gray-400" htmlFor={field.name}>
                  {field.label}:
                </label>
              )}
              {errors[field.name as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name as keyof typeof errors]}
                </p>
              )}
              {(() => {
                switch (field.type) {
                  case "file":
                    return (
                      <input
                        id={field.name}
                        type="file"
                        name={field.name}
                        required={field.required}
                        className="border border-gray-400 p-1 text-sm w-full"
                        accept="image/*"
                      />
                    );

                  case "textarea":
                    return (
                      <div key={field.name}>
                        <RichTextEditor
                          name={field.name}
                          onChange={(value) =>
                            handleRichTextChange(field.name, value)
                          }
                        />
                        <input
                          type="hidden"
                          name={field.name}
                          value={JSON.stringify(richTextData[field.name] || {})}
                        />
                      </div>
                    );
                  case "text":
                  case "email":
                    return (
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        maxLength={field.maxLength}
                        required={field.required}
                        className="border border-gray-400 p-1 text-sm w-full"
                      />
                    );

                  case "date":
                  case "number":
                    return (
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        className="border border-gray-400 p-1 text-sm w-full"
                      />
                    );

                  case "boolean":
                    return (
                      <div className="flex items-center space-x-4">
                        <label>
                          <input
                            type="radio"
                            name={field.name}
                            value="true"
                            checked={boolean === true}
                            onChange={() => setBoolean(true)}
                          />
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={field.name}
                            value="false"
                            checked={boolean === false}
                            onChange={() => setBoolean(false)}
                          />
                          No
                        </label>
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          ))}
        {/*<input type="hidden" value={petitionDocumentId} name="petition" />*/}
        <span className="block border border-gray-400 p-1 text-red-400 mb-3 p-2">
          Add
          <code className="bg-gray-300 text-black p-1 mx-2">{r}</code>
          to human check field below
        </span>
        <label htmlFor="human" className="text-gray-400">
          Human Check Field:
        </label>
        <input
          id="human"
          className="border border-gray-400 mb-3 p-1 text-sm text-slate-800"
          type="text"
          name="human"
          required
        />
        <button
          type="submit"
          className={`w-full mb-2 py-1 text-white capitalize hover:bg-gray-350 cursor-pointer ${processing ? "bg-gray-400" : " bg-blue-600"}`}
        >
          {processing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-5 w-5 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            "Submit"
          )}
        </button>
        <output
          name="result"
          htmlFor="email"
          className={`rounded border p-1 ${
            humanError
              ? "border-red-600 text-red-600"
              : "border-green-600 text-green-600"
          } ${message === "" ? "hidden" : "block"}`}
          dangerouslySetInnerHTML={{ __html: message }}
        />{" "}
        {messageSend.errorMessage && (
          <output className="p-2 flex items-center justify-center text-red-600 block bg-red-200 h-16">
            {messageSend.errorMessage}
          </output>
        )}
        {messageSend.successMessage && (
          <output className="p-2 flex items-center justify-center text-green-600 block bg-green-200 h-16">
            {messageSend.successMessage}
          </output>
        )}
      </form>
    </section>
  );
}
