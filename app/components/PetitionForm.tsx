"use client";

//// todo:
// if user logged in form fields
// on sign complete redirect, or show success res, remove form
import { useRouter } from "next/navigation";
import { useState, useRef, ReactNode } from "react";
import { createSignatureAction } from "@/lib/actions";
import { validateInput, humanValidator } from "@/lib/clientFunctions";
import {
  FormSection,
  Member,
  CreateSignature,
  SelectOption,
  SelectField,
  FormFields,
  CreateResponseAction,
} from "@/lib/types";

type Props = {
  children: ReactNode;
};
let r = (Math.random() + 1).toString(36).substring(7);
type FormValues = {
  first_name: string;
  last_name: string;
  postcode: string;
  email: string;
  comment: string;
  mailing_list: boolean;
};

export default function PetitionForm({
  section,
  className,
  userDocumentId,
  petitionDocumentId,
  petitionTitle,
}: {
  section: FormSection;
  className: string;
  userDocumentId: string;
  petitionDocumentId: string;
  petitionTitle: string;
}) {
  const router = useRouter();
  const { form_field } = section;
  const formRef = useRef<HTMLFormElement>(null);
  const [count, setCount] = useState(0);
  const [humanError, setHumanError] = useState(false);
  const [message, setMessage] = useState("");
  const initValues = (form_field as unknown as { name: string }[]).reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {} as Record<string, string>,
  );
  // console.log(userDocumentId, petitionDocumentId, "user petid");
  // const [formValues, setFormValues] = useState<FormValues>({
  //   first_name: "",
  //   last_name: "",
  //   postcode: "",
  //   email: "",
  //   mailing_list: false,
  // });

  const [state, setState] = useState(initValues);
  const [boolean, setBoolean] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messageSend, setMessageSend] = useState({
    errorMessage: "",
    successMessage: "",
  });

  const [errors, setErrors] = useState<{
    [key in keyof FormValues]: boolean | string | "";
  }>({
    first_name: "",
    last_name: "",
    postcode: "",
    email: "",
    comment: "",
    mailing_list: false,
  });

  const triggerCreatePetitionSignature = async ({
    data,
  }: {
    data: CreateSignature;
  }) => {
    // console.log("router", router);
    setErrors({
      first_name: "",
      last_name: "",
      postcode: "",
      email: "",
      comment: "",
      mailing_list: false,
    });
    try {
      const res: CreateResponseAction = await createSignatureAction(data);
      console.log(res, "ress");
      if (res && "error" in res && res.error) {
        setMessageSend((prev) => ({
          ...prev,
          errorMessage: res?.error?.message as string,
          successMessage: "",
        }));
      } else if (res && "first_name" in res) {
        setMessageSend((prev) => ({
          ...prev,
          errorMessage: "",
          successMessage:
            `Success: ${res.first_name} added name to petition!` as string,
        }));

        // Redirect to success page with query params
        const queryParams = new URLSearchParams({
          first_name: res.first_name || "",
          last_name: res.last_name || "",
          page_url: window.location.href,
          title: petitionTitle,
          // Add any other properties from res you want to pass
        }).toString();

        router.push(`/petitions/support-success?${queryParams}`);
      }
    } catch (error) {
      console.log("Error creating signature:", error);
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
        [key in keyof CreateSignature]: string | boolean | "";
      } = {
        first_name: "",
        last_name: "",
        postcode: "",
        email: "",
        mailing_list: false,
        comment: "",
      };

      const formData = new FormData(formRef.current);
      const mailingListValue = formData.get("mailing_list");
      const mailing_list = mailingListValue === "true";

      const fieldsToValidate: Array<
        | "first_name"
        | "last_name"
        | "email"
        | "postcode"
        | "comment"
        | "mailing_list"
        | "display_name"
      > = [
        "first_name",
        "last_name",
        "email",
        "postcode",
        "comment",
        "mailing_list",
        "display_name",
      ];

      const data: CreateSignature = {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        email: formData.get("email") as string,
        postcode: formData.get("postcode") as string,
        comment: formData.get("comment") as string,
        mailing_list,
        display_name: formData.get("display_name") === "true",
        petition:{connect: {documentId:petitionDocumentId}},
      };

      for (const field of fieldsToValidate) {
        const errorMessage = validateInput(field, data[field] as string);
        newErrors[field] = errorMessage || "";
      }

      // data.petitionId = petitionDocumentId as string;
      if (userDocumentId) {
        data.user = userDocumentId as string;
      }

      const hasErrors = Object.values(newErrors).some((error) => error !== "");

      if (!hasErrors) {
        await triggerCreatePetitionSignature({ data });
        formRef.current?.reset();
      } else {
        setErrors(newErrors);
        console.log("Validation errors:", newErrors);
      }

      setProcessing(false);
    }
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
        <h2 className=" md:text-lg mb-3 font-bold font-sans">
          {section.heading}
        </h2>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 ${className} bg-white font-sans text-sm`}
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
                <p className="!text-red-500 text-sm mt-1">
                  {errors[field.name as keyof typeof errors]}
                </p>
              )}
              {(() => {
                switch (field.type) {
                  case "textarea":
                    return (
                      <textarea
                        id={field.name}
                        name={field.name}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        required={field.required}
                        rows={5}
                        className="border border-gray-400 p-1 text-sm w-full"
                      />
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
                    {
                      /*                  case "hidden":
                    return (
                      <input
                        value={field.name === "user" ? userDocumentId : ""}
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        maxLength={field.maxLength}
                        required={field.required}
                        className="border border-gray-400 p-1 text-sm w-full"
                      />
                    );*/
                    }
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
        <span className="block border border-gray-400 p-1 !text-orange-600 mb-3 p-2">
          Add
          <code className="bg-gray-300 text-black p-1 mx-2">{r}</code>
          to human field
        </span>
        <label htmlFor="human" className="text-gray-400">
          Human field:
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
          className={`w-full mb-2 rounded py-1 text-white capitalize hover:bg-gray-350 cursor-pointer ${processing ? "bg-gray-400" : " bg-blue-600"}`}
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
              ? "!border-red-600 text-red-600"
              : "!border-green-600 text-green-600"
          } ${message === "" ? "hidden" : "block"}`}
          dangerouslySetInnerHTML={{ __html: message }}
        />{" "}
        {messageSend.errorMessage && (
          <output className="p-2 flex items-center justify-center !text-orange-600 block bg-red-200 h-16">
            {messageSend.errorMessage}
          </output>
        )}
        {messageSend.successMessage && (
          <output className="p-2 flex items-center justify-center !text-green-600 block bg-green-200 h-16">
            {messageSend.successMessage}
          </output>
        )}
      </form>
    </section>
  );
}
