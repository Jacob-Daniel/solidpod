"use client";

import { useState, useRef, ReactNode } from "react";
import { createMembershipAction } from "@/lib/actions";
import { validateInput, humanValidator } from "@/lib/clientFunctions";
import { useSolidSession } from "@/lib/sessionContext";

import {
  FormSection,
  Member,
  CreateMembership,
  SelectOption,
  SelectField,
  FormFields,
} from "@/lib/types";

type Props = {
  children: ReactNode;
};
let r = (Math.random() + 1).toString(36).substring(7);
type FormValues = {
  name: string;
  message: string;
};

export default function ContactForm({
  section,
  className,
}: {
  section: FormSection;
  className: string;
}) {
  const { webId } = useSolidSession();
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

  // const [formValues, setFormValues] = useState<FormValues>({
  //   name: "",
  //   message: "",
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
    name: "",
    message: "",
  });

  const triggerCreateCustomer = async ({
    data,
  }: {
    data: CreateMembership;
  }) => {
    setErrors({
      name: "",
      message: "",
    });
    try {
      const res = await createMembershipAction(data);
      if (res && "error" in res && res.error) {
        setMessageSend((prev) => ({
          ...prev,
          errorMessage: res?.error?.message as string,
          successMessage: "",
        }));
      } else if (res && !("error" in res)) {
        setMessageSend((prev) => ({
          ...prev,
          errorMessage: "",
          successMessage: `Success: Feedback submitted!` as string,
        }));
      }
    } catch (error) {
      console.log("Error creating membership:", error);
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
        [key in keyof CreateMembership]: string | boolean | "";
      } = {
        name: "",
        message: "",
        webId: "",
      };

      const formData = new FormData(formRef.current);

      const data: CreateMembership = {
        name: formData.get("name") as string,
        message: formData.get("message") as string,
        webId: webId || "",
      };

      const hasErrors = Object.values(newErrors).some((error) => error !== "");

      if (!hasErrors) {
        await triggerCreateCustomer({ data });
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
              <label className="text-gray-400" htmlFor={field.name}>
                {field.label}:
              </label>
              {errors[field.name as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">
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
        <span className="block border border-gray-400 p-1 text-red-400 mb-3 p-2">
          Add
          <code className="bg-gray-300 text-black p-1 mx-2">{r}</code>
          below.
        </span>
        <input
          id="human"
          className="border border-gray-400 mb-3 p-1 text-sm"
          type="text"
          name="human"
          required
        />
        <button
          type="submit"
          className="w-[100px] mb-2 py-1 bg-orange-700 text-white capitalize hover:bg-gray-350 cursor-pointer"
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
