import React, { useEffect, useState } from "react";
import "./updatePost.scss";
import SelectDropdown from "../../../../components/FormComponents/SelectDropdown/Select";
import Dropzone from "../../../../components/FormComponents/Dropzone/Dropzone";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategoriesAction } from "../../../../redux/slices/categories/categoriesSlices";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPostDetailAction,
  updatePostAction,
} from "../../../../redux/slices/posts/postSlices";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const category = useSelector((state) => state.categories);
  const { categoryList } = category;

  const allCategories = categoryList?.map((categoryItem) => {
    return categoryItem.title;
  });

  const post = useSelector((state) => state.posts);
  const { postDetail } = post;

  const postUpdate = useSelector((state) => state.posts);
  const {
    isUpdated,
    loading: updateLoading,
    appError: updateAppError,
    serverError: updateServerError,
  } = postUpdate;

  const [defaultValue, setDefaultValue] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchPostDetailAction(id));

    if (post) {
      setDefaultValue(postDetail?.title);
    }
  }, [dispatch]);

  console.log(id);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: postDetail?.title,
      description: postDetail?.description,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: true,
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    (async () => {
      await sleep(50);
      setValue("categories", allCategories, { shouldValidate: true });
      reset({ categories: allCategories });
    })();
  }, []);

  const onSubmit = (data) => {
    const payload = {
      category: data?.categories?.value,
      title: data?.title,
      description: data?.description,
      image: data?.image,
      id,
    };
    dispatch(updatePostAction(payload));
  };

  if (isUpdated) {
    navigate("/posts");
  }

  return (
    <div className="create-post">
      <h1>Update your post</h1>
      <form className="create-post__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="text__container">
          <label>title</label>
          <input
            name="title"
            ref={register}
            {...register("title", {
              required: "Please enter a title.",
            })}
            type="text"
            defaultValue={defaultValue}
          />
        </div>
        {errors.title && (
          <span className="error-required-field">This field is required.</span>
        )}

        {/* //---------------------------------------------------------------- */}
        {/* // Category Dropdown */}
        {/* //---------------------------------------------------------------- */}

        <SelectDropdown
          name={"categories"}
          label={"Category"}
          control={control}
          values={allCategories}
        />

        <div className="text__container">
          <label>description</label>
          <input
            name="description"
            ref={register}
            {...register("description", {
              required: "Please enter your post description.",
            })}
            type="text"
          />
        </div>
        {errors.description && (
          <span className="error-required-field">This field is required.</span>
        )}

        {/* /------------------------------------------------ */}
        {/* /-------------------Image Upload----------------- */}
        {/* /------------------------------------------------ */}
        <Controller
          name="image"
          control={control}
          render={({ field }) => {
            return (
              <Dropzone
                onChange={(files) => field.onChange(files?.[0])}
                name="file alt text"
                label="File Upload"
                files={field.value ? [field.value] : []}
              />
            );
          }}
        />

        {updateLoading ? (
          <button disabled className="create-post__button">
            Loading...
          </button>
        ) : (
          <button type="submit" className="create-post__button">
            Update Post
          </button>
        )}

        {updateAppError || updateServerError ? (
          <p>
            {updateServerError} - {updateAppError}
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default UpdatePost;
