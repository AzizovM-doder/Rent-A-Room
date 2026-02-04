import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  createListing,
  deleteListing,
  fetchListings,
  updateListing,
} from "../../reducers/listingSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

const empty = {
  id: "",
  nameEn: "",
  nameRu: "",
  nameTj: "",
  locationEn: "",
  locationRu: "",
  locationTj: "",
  typeEn: "",
  typeRu: "",
  typeTj: "",
  rooms: "",
  price: "",
  about: "",
  image: "",
};

const toPayload = (f) => ({
  id: f.id ? Number(f.id) : undefined,
  name: { en: f.nameEn, ru: f.nameRu, tj: f.nameTj },
  location: { en: f.locationEn, ru: f.locationRu, tj: f.locationTj },
  type: { en: f.typeEn, ru: f.typeRu, tj: f.typeTj },
  rooms: Number(f.rooms || 0),
  price: Number(f.price || 0),
  about: f.about || "",
  image: f.image || "",
});

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminListings = () => {
  const dispatch = useDispatch();
  const {
    items = [],
    loading,
    saving,
    deletingId,
    error,
  } = useSelector((s) => s.listings || {});

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(empty);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const openCreate = () => {
    setMode("create");
    setForm(empty);
    setOpen(true);
    dispatch(clearError());
  };

  const openEdit = (x) => {
    setMode("edit");
    setForm({
      id: x.id,
      nameEn: x?.name?.en || "",
      nameRu: x?.name?.ru || "",
      nameTj: x?.name?.tj || "",
      locationEn: x?.location?.en || "",
      locationRu: x?.location?.ru || "",
      locationTj: x?.location?.tj || "",
      typeEn: x?.type?.en || "",
      typeRu: x?.type?.ru || "",
      typeTj: x?.type?.tj || "",
      rooms: String(x.rooms ?? ""),
      price: String(x.price ?? ""),
      about: x.about || "",
      image: x.image || "",
    });
    setOpen(true);
    dispatch(clearError());
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const payload = toPayload(form);
    if (mode === "create") {
      await dispatch(createListing(payload));
      setOpen(false);
    } else {
      await dispatch(updateListing({ id: form.id, payload }));
      setOpen(false);
    }
  };

  const onPickImage = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setForm((p) => ({ ...p, image: base64 }));
  };

  return (
    <div className="min-h-[75vh] px-4 py-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Listings</h1>
            <p className="text-sm text-muted-foreground">json-server CRUD</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => dispatch(fetchListings())}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={openCreate}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="rounded-2xl pt-0 ">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => dispatch(clearError())}>
                Close
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {items.length === 0 && !loading ? (
          <Card className="rounded-2xl">
            <CardContent className="p-10 text-center">
              <p className="font-semibold">No data</p>
              <p className="text-sm text-muted-foreground">
                Create first listing.
              </p>
              <div className="pt-4 flex justify-center">
                <Button
                  onClick={openCreate}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {items.map((x) => (
              <Card
                key={x.id}
                className="rounded-2xl overflow-hidden pt-0 hover:shadow-md transition"
              >
                <div className="h-44 w-full bg-muted overflow-hidden">
                  {x.image ? (
                    <img
                      src={x.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold leading-tight">
                        {x?.name?.en || "Untitled"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {x?.location?.en || "—"}
                      </p>
                    </div>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">
                      ${x.price ?? 0}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => openEdit(x)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={() => dispatch(deleteListing(x.id))}
                      disabled={String(deletingId) === String(x.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {String(deletingId) === String(x.id) ? "..." : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{mode === "create" ? "Create" : "Edit"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl border overflow-hidden">
                  <div className="h-48 w-full bg-muted">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                        Upload image
                      </div>
                    )}
                  </div>
                </div>

                <Input type="file" accept="image/*" onChange={onPickImage} />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Price"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Rooms"
                    type="number"
                    value={form.rooms}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, rooms: e.target.value }))
                    }
                  />
                </div>

                <Textarea
                  placeholder="About"
                  className="min-h-28"
                  value={form.about}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, about: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">Name</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="EN"
                    value={form.nameEn}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nameEn: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="RU"
                    value={form.nameRu}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nameRu: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="TJ"
                    value={form.nameTj}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nameTj: e.target.value }))
                    }
                  />
                </div>

                <p className="text-sm font-semibold pt-2">Location</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="EN"
                    value={form.locationEn}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, locationEn: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="RU"
                    value={form.locationRu}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, locationRu: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="TJ"
                    value={form.locationTj}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, locationTj: e.target.value }))
                    }
                  />
                </div>

                <p className="text-sm font-semibold pt-2">Type</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="EN"
                    value={form.typeEn}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, typeEn: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="RU"
                    value={form.typeRu}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, typeRu: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="TJ"
                    value={form.typeTj}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, typeTj: e.target.value }))
                    }
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminListings;
