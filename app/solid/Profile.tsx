"use client";
import type { FC } from "react";
import { useEffect, useState, useCallback } from "react";
import { useSolidSession } from "@/lib/sessionContext";
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
import { sanitiseFile, ALLOWED_IMAGE_TYPES } from "@/lib/solid/sanitiseFile";
import ProfileCard from "@/app/solid/ProfileCard";

type Visibility = "private" | "public";

const Profile: FC = () => {
  const { isLoggedIn, webId, session, isVerified } = useSolidSession();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");

  const loadProfile = useCallback(async () => {
    if (!webId) return;
    setLoading(true);
    try {
      const dataset = await getSolidDataset(webId, { fetch: session.fetch });
      const thing = getThing(dataset, webId);
      if (!thing) return;

      const mboxUrl = getUrl(thing, FOAF.mbox) ?? "";
      const email = mboxUrl.replace(/^mailto:/, "");

      setProfileData({
        name: getStringNoLocale(thing, FOAF.name) ?? "",
        email,
        image: getUrl(thing, FOAF.img) ?? getUrl(thing, VCARD.hasPhoto) ?? "",
      });
    } catch (e) {
      console.error("Error loading profile:", e);
    } finally {
      setLoading(false);
    }
  }, [webId, session.fetch]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError("");
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const result = await sanitiseFile(file, ALLOWED_IMAGE_TYPES);
    if (!result.ok) {
      setAvatarError(result.error ?? "Invalid image file.");
      e.target.value = "";
      return;
    }
    setAvatar(new File([file], result.safeName!, { type: result.mime }));
  };

  const handleSave = async () => {
    if (!webId) return;
    setSaving(true);
    setError("");
    try {
      const dataset = await getSolidDataset(webId, { fetch: session.fetch });
      let thing = getThing(dataset, webId);
      if (!thing) {
        setError("Could not load profile.");
        return;
      }
      if (avatar) {
        const podRoot = webId.replace(/\/profile\/card#me$/, "") + "/";
        const fileUrl = await uploadAvatar(avatar, podRoot, session, {
          private: visibility === "private",
          public: visibility === "public",
        });
        thing = setUrl(thing, FOAF.img, fileUrl);
        setProfileData((prev) => ({ ...prev, image: fileUrl }));
      }
      thing = setStringNoLocale(thing, FOAF.name, profileData.name);
      thing = setUrl(thing, FOAF.mbox, `mailto:${profileData.email}`);
      await saveSolidDatasetAt(webId, setThing(dataset, thing), {
        fetch: session.fetch,
      });
      setAvatar(null);
      setEditMode(false);
    } catch (e) {
      console.error("Error saving profile:", e);
      setError("Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    setError("");
    setAvatarError("");
  };

  if (!isLoggedIn || loading) {
    return <p className="text-neutral-400 text-sm">Loading profile…</p>;
  }

  return (
    <div className="col-span-12 flex flex-col gap-4">
      <ProfileCard
        isVerified={isVerified}
        webId={webId ?? ""}
        name={profileData.name}
        email={profileData.email}
        image={profileData.image}
        editMode={editMode}
        saving={saving}
        visibility={visibility}
        avatar={avatar}
        avatarError={avatarError}
        error={error}
        onNameChange={(val) =>
          setProfileData((prev) => ({ ...prev, name: val }))
        }
        onEmailChange={(val) =>
          setProfileData((prev) => ({ ...prev, email: val }))
        }
        onVisibilityChange={setVisibility}
        onAvatarChange={handleAvatarChange}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
      />
    </div>
  );
};

export default Profile;
