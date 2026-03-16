"use client";
import type { FC } from "react";
import Image from "next/image";

type Visibility = "private" | "public";

interface ProfileCardProps {
  webId: string;
  name: string;
  email: string;
  image: string;
  editMode: boolean;
  saving: boolean;
  visibility: Visibility;
  avatar: File | null;
  avatarError: string;
  error: string;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onVisibilityChange: (val: Visibility) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditToggle: () => void;
  onSave: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPodHandle(webId: string): { username: string; host: string } {
  try {
    const url = new URL(webId);
    const username = url.pathname.split("/").filter(Boolean)[0] ?? "";
    return { username, host: url.host };
  } catch {
    return { username: webId, host: "" };
  }
}

const ProfileCard: FC<ProfileCardProps> = ({
  webId,
  name,
  email,
  image,
  editMode,
  saving,
  visibility,
  avatar,
  avatarError,
  error,
  onNameChange,
  onEmailChange,
  onVisibilityChange,
  onAvatarChange,
  onEditToggle,
  onSave,
}) => {
  const { username, host } = getPodHandle(webId);
  const initials = getInitials(name);

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden max-w-md w-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="shrink-0">
          {image ? (
            <Image
              src={image}
              alt="Profile picture"
              width={56}
              height={56}
              className="rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-base select-none">
              {initials || "?"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {name || "No name set"}
          </p>
          <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">
            {username}
            {host && (
              <span className="text-neutral-300 dark:text-neutral-600">
                {" "}
                · {host}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            registered
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            pod owner
          </span>
        </div>
      </div>

      {/* Public profile — view mode */}
      {!editMode && (
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mb-3">
            Public profile
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                Name
              </span>
              <span className="text-[13px] text-neutral-900 dark:text-neutral-100">
                {name || (
                  <span className="text-neutral-400 italic">Not set</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
                Email
              </span>
              <span className="text-[13px] text-neutral-900 dark:text-neutral-100">
                {email || (
                  <span className="text-neutral-400 italic">Not set</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pod identity — always visible */}
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mb-3">
          Pod identity
        </p>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <span className="text-[13px] text-neutral-500 dark:text-neutral-400 shrink-0">
              WebID
            </span>
            <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 text-right break-all">
              {webId}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
              Pod login
            </span>
            <span className="text-[12px] text-neutral-400 dark:text-neutral-500 italic">
              stored in pod server only
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editMode && (
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
            Edit public profile
          </p>

          {/* Contextual notice */}
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3.5 py-3 text-[12px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            These details are saved to your{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Solid pod
            </span>{" "}
            as public contact info — separate from your pod login credentials.
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-neutral-400 dark:text-neutral-500">
              Display name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-neutral-400 dark:text-neutral-500">
              Public contact email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          {/* Avatar */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-neutral-400 dark:text-neutral-500">
              Profile image
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-[13px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Choose image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </label>
            {avatar && (
              <p className="text-[12px] text-neutral-400">{avatar.name}</p>
            )}
            {avatarError && (
              <p role="alert" className="text-[12px] text-red-500">
                {avatarError}
              </p>
            )}
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-neutral-400 dark:text-neutral-500">
              Image visibility
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["private", "public"] as Visibility[]).map((v) => (
                <label
                  key={v}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] cursor-pointer transition-colors ${
                    visibility === v
                      ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                      : "border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={v}
                    checked={visibility === v}
                    onChange={() => onVisibilityChange(v)}
                    className="hidden"
                  />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      visibility === v
                        ? "bg-blue-500"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    }`}
                  />
                  {v === "private" ? "Private (only me)" : "Public read"}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-6 py-2">
          <p role="alert" className="text-[12px] text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Footer actions */}
      <div className="px-6 py-4 flex items-center gap-2">
        {!editMode ? (
          <button
            onClick={onEditToggle}
            className="rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[13px] font-medium px-4 py-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            Edit profile
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[13px] font-medium px-4 py-2 hover:opacity-80 disabled:opacity-40 transition-opacity cursor-pointer"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={onEditToggle}
              className="rounded-lg border border-neutral-200 dark:border-neutral-700 text-[13px] text-neutral-600 dark:text-neutral-400 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
