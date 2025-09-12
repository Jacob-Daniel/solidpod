"use client";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";
import Image from "next/image";
import {
  getSolidDataset,
  getThing,
  setThing,
  saveSolidDatasetAt,
  getStringNoLocale,
  getUrl,
  setStringNoLocale,
  setUrl,
} from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";
import { uploadAvatar } from "@/lib/uploadAvatar";

const Profile: FC = () => {
  const { isLoggedIn, webId, session } = useSolidSession();
  const [profileData, setProfileData] = useState<Record<string, string>>({});
  const [avatar, setAvatar] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [permissions, setPermissions] = useState({
    private: true,
    public: false,
  });
  console.log(session, "session");
  const loadProfile = async () => {
    if (!webId) return;
    try {
      const dataset = await getSolidDataset(webId, { fetch: session.fetch });
      const thing = getThing(dataset, webId);
      if (!thing) return;

      setProfileData({
        name: getStringNoLocale(thing, FOAF.name) || "",
        email: getStringNoLocale(thing, FOAF.mbox) || "",
        image: getUrl(thing, FOAF.img) || getUrl(thing, VCARD.hasPhoto) || "",
      });
    } catch (e: any) {
      console.error("Error loading profile:", e);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [webId, session.fetch]);

  const handleSave = async () => {
    if (!webId) return;
    setSaving(true);
    setError("");

    try {
      const dataset = await getSolidDataset(webId, { fetch: session.fetch });
      let thing = getThing(dataset, webId);
      if (!thing) {
        setError("Could not load profile thing.");
        setSaving(false);
        return;
      }

      // Handle avatar upload using helper
      if (avatar) {
        const podRoot = webId.split("/").slice(0, -1).join("/") + "/";
        const fileUrl = await uploadAvatar(
          avatar,
          podRoot,
          session,
          permissions,
        );

        thing = setUrl(thing, FOAF.img, fileUrl);
        setProfileData((prev) => ({ ...prev, image: fileUrl }));
      }

      // Save name & email
      thing = setStringNoLocale(thing, FOAF.name, profileData.name);
      thing = setStringNoLocale(thing, FOAF.mbox, profileData.email);

      const updatedDataset = setThing(dataset, thing);
      await saveSolidDatasetAt(webId, updatedDataset, { fetch: session.fetch });

      setEditMode(false);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) return <p>Loading...</p>;

  return (
    <div className="col-span-12 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {profileData.image ? (
          <Image
            width={60}
            height={60}
            src={profileData.image}
            alt="Profile picture"
            className="w-24 h-24 rounded-full border"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full border bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 items-start">
        {Object.entries(profileData).map(([key, value]) =>
          key === "image" ? (
            editMode && (
              <div key={key}>
                <label className="cursor-pointer bg-blue-500 dark:bg-zinc-800 text-white px-3 py-1 rounded">
                  Choose Image for Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setAvatar(e.target.files[0]);
                    }}
                  />
                </label>

                <div className="flex gap-3 items-center">
                  <label>
                    <input
                      type="checkbox"
                      checked={permissions.private}
                      onChange={(e) =>
                        setPermissions((prev) => ({
                          ...prev,
                          private: e.target.checked,
                        }))
                      }
                    />
                    Private (only me)
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={permissions.public}
                      onChange={(e) =>
                        setPermissions((prev) => ({
                          ...prev,
                          public: e.target.checked,
                        }))
                      }
                    />
                    Public read
                  </label>
                </div>
              </div>
            )
          ) : editMode ? (
            <input
              key={key}
              className="border border-gray-300 dark:border-zinc-800 w-full px-2 py-1"
              value={value}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder={key}
            />
          ) : (
            <p key={key}>
              <strong>{key}: </strong>
              {value || "Not set"}
            </p>
          ),
        )}

        <button
          onClick={() => setEditMode(!editMode)}
          className="border px-3 py-1 rounded bg-blue-500 dark:bg-zinc-800 text-white cursor-pointer"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>

        {editMode && (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="border text-white cursor-pointer bg-green-600 flex-shrink px-3 py-1 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {error && <span className="text-red-500 p-1">{error}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
