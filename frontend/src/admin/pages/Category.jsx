import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit3, Trash2, Plus, Search, X } from "lucide-react";
import { categorySchema } from "@/validations/category.validator.js";
import { useCategory } from "@/hooks/useCategory";
import ConfirmDialog from "@/hoc/ConfirmDialog";
import WithPagination from "@/hoc/WithPagination";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";

const Category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const {
    categories,
    createCategory,
    deleteCategory,
    updateCategory,
    isCreating,
    isUpdating,
    pagination,
  } = useCategory({ page, limit: 10, search: debouncedSearch });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleSubmit = () => {
    const result = categorySchema.safeParse({ name: categoryName });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (isEdit) {
      updateCategory(
        { id: selectedId, data: { name: categoryName } },
        {
          onSuccess: () => {
            resetForm();
          },
        },
      );
    } else {
      createCategory(
        { name: categoryName },
        {
          onSuccess: () => {
            resetForm();
          },
        },
      );
    }
  };

  const handleDelete = () => {
    deleteCategory(deleteId, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteId(null);
      },
    });
  };

  const resetForm = () => {
    setCategoryName("");
    setSelectedId(null);
    setIsEdit(false);
    setOpen(false);
  };
  return (
    <div className="p-8 min-h-screen transition-colors duration-500">
      <div className="max-w-8xl mx-auto space-y-8">
        {/* Top Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight gradient-text">
              Categories
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your content organization
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => {
                  setOpen(true);
                  setIsEdit(false);
                  setCategoryName("");
                  setSelectedId(null);
                }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-elegant hover:opacity-90 transition-all active:scale-95"
              >
                <Plus size={20} />
                Add New
              </button>
            </DialogTrigger>
            <DialogContent className="glass border-border/40 sm:max-w-[425px] ">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold gradient-text">
                  {isEdit ? "Edit Category" : "Create Category"}
                </DialogTitle>
                <p className="text-muted-foreground text-sm">
                  Add a new category name for your blog or project.
                </p>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold px-1">
                    Category Name
                  </label>
                  <input
                    id="name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter Category"
                    className="w-full bg-secondary/50 border border-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs px-1">{errors.name}</p>
                )}
              </div>
              <DialogFooter>
                <button
                  onClick={handleSubmit}
                  disabled={isCreating || isUpdating}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : isEdit
                      ? "Update Category"
                      : "Save Category"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories..."
            className="h-12 w-full pl-11 pr-11 rounded-full bg-card border-border/60 shadow-soft"
          />

          {/* Clear Button */}
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {/* Shadcn Table Wrapper */}
        <div className="glass rounded-[2rem] overflow-hidden border border-border/40 shadow-card">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[100px] py-5 px-6 font-bold text-foreground">
                  ID
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Category Name
                </TableHead>
                <TableHead className="text-right py-5 px-6 font-bold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((item) => (
                  <TableRow
                    key={item.id}
                    className="group border-border/40 hover:bg-primary/[0.02] transition-smooth"
                  >
                    <TableCell className="py-4 px-6 font-medium text-muted-foreground">
                      #{item.id}
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-foreground">
                      {item.name}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setIsEdit(true);
                            setOpen(true);
                            setCategoryName(item.name);
                            setSelectedId(item.id);
                          }}
                          className="p-2.5 rounded-xl bg-background border border-border hover:border-primary dark:hover:text-primary hover:text-primary transition-all shadow-soft text-black dark:text-white"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(item.id);
                            setDeleteOpen(true);
                          }}
                          className="p-2.5 rounded-xl bg-background border border-border hover:border-destructive dark:hover:text-destructive hover:text-destructive transition-all shadow-soft text-black dark:text-white"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="bg-muted p-3 rounded-full">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          No categories found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {search
                            ? `No results for "${search}". Try another keyword.`
                            : "Your category list is currently empty."}
                        </p>
                      </div>
                      {!search && (
                        <button
                          onClick={() => setOpen(true)}
                          className="mt-2 text-primary hover:underline font-medium text-sm flex items-center gap-1"
                        >
                          
                          <Plus size={16} /> Add your first category
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <WithPagination
          page={page}
          totalPages={pagination?.totalPages}
          onPageChange={setPage}
        />

        <ConfirmDialog
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Category?"
          description="This category will be permanently deleted."
          confirmText="Delete"
          loading={false}
        />

        {/* <p className="text-xs text-muted-foreground/60 text-center">
          Showing {categories.length} total categories
        </p> */}
      </div>
    </div>
  );
};

export default Category;
