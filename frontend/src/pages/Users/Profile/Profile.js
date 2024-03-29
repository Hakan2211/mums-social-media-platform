import React, { useEffect } from "react";
import "./profile.scss";
import {
  followUserAction,
  unfollowUserAction,
  userProfileAction,
} from "../../../redux/slices/users/usersSlices";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoMailOutline,
} from "react-icons/io5";

import { MdFileUpload } from "react-icons/md";
import { MdAddCircle } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md";
import {
  RiUserFollowLine,
  RiUserUnfollowLine,
  RiLockPasswordLine,
} from "react-icons/ri";
import PostCard from "../../Posts/PostList/PostCard/PostCard";
import { accountVerificationSendToken } from "../../../redux/slices/accountVerification/accountVerificationSlices";
import DateFormatter from "../../../components/DateFormatter/DateFormatter";

const Profile = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users);
  const {
    profile,
    loading,
    appError,
    serverError,
    userAuth,
    followed,
    unfollowed,
  } = user;

  const post = useSelector((state) => state?.posts);

  const { likes } = post;

  //const account = useSelector((state) => state?.accountVerification);

  const sendMailHandler = () => {
    navigate("/send-email", {
      state: { email: profile?.email, id: profile?._id },
    });
  };

  useEffect(() => {
    dispatch(userProfileAction(id));
  }, [dispatch, id, followed, unfollowed, likes]);

  const isLoginUser = userAuth?._id === profile?._id;

  return (
    <div className="userprofile">
      <div className="userprofile__container">
        {loading ? (
          <h1>Loading...</h1>
        ) : appError || serverError ? (
          <h1>
            {serverError} - {appError}
          </h1>
        ) : (
          <>
            <div className="userprofile__container__header">
              <div className="userprofile__container__header__picture">
                <img src={profile?.profilePicture} alt="profilePicture" />
                {isLoginUser ? (
                  <Link to={`/upload-photo/${profile?._id}`}>
                    <div className="userprofile__container__header__picture__upload">
                      <MdFileUpload className="userprofile__container__header__picture__upload__icon" />

                      {/* <button className="userprofile__container__header__picture__upload__button">
                        Upload Photo
                      </button> */}
                    </div>{" "}
                  </Link>
                ) : null}
                {isLoginUser ? (
                  <Link to={`/update-profile/${profile?._id}`}>
                    <div className="userprofile__container__header__picture__update">
                      <MdOutlineModeEditOutline className="userprofile__container__header__picture__update__icon" />

                      {/* <button className="userprofile__container__header__picture__upload__button">
                        Upload Photo
                      </button> */}
                    </div>
                  </Link>
                ) : null}
              </div>
              <div className="userprofile__container__header__info">
                <div className="userprofile__container__header__info__verification">
                  <div className="userprofile__container__header__info__verification__info">
                    {profile?.isAccountVerified ? (
                      <div className="userprofile__container__header__info__verification__info__container__verified">
                        <div className="userprofile__container__header__info__verification__info__container__verified__icon-verified">
                          <IoCheckmarkCircle />
                        </div>
                        <div className="userprofile__container__header__info__verification__info__container__verified__text-verified">
                          Verifiziert
                        </div>
                      </div>
                    ) : (
                      <div className="userprofile__container__header__info__verification__info__container__unverified">
                        <div className="userprofile__container__header__info__verification__info__container__unverified__icon-unverified">
                          <IoCloseCircle />
                        </div>
                        <div className="userprofile__container__header__info__verification__info__container__unverified__text-unverified">
                          Unverifiziert
                        </div>
                      </div>
                    )}
                  </div>
                  {!profile?.isAccountVerified && isLoginUser ? (
                    <div className="userprofile__container__header__info__verification__button__container">
                      <button
                        className="userprofile__container__header__info__verification__button"
                        onClick={() => dispatch(accountVerificationSendToken())}
                      >
                        Verifiziere dein Account
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="userprofile__container__header__info__data">
                  <div className="userprofile__container__header__info__data__name">
                    {profile?.name}
                  </div>
                  <div className="userprofile__container__header__info__data__joined">
                    Angemeldet seit: <DateFormatter date={profile?.createdAt} />
                  </div>
                </div>
                <div className="userprofile__container__header__info__follow-container">
                  {!isLoginUser && profile?.isFollowing ? (
                    <div
                      classname="userprofile__container__header__info__follow-container__unfollow"
                      onClick={() => dispatch(unfollowUserAction(id))}
                    >
                      <div className="userprofile__container__header__info__follow-container__unfollow__icon">
                        <RiUserUnfollowLine />
                      </div>

                      <div className="userprofile__container__header__info__follow-container__unfollow__text">
                        Unfollow
                      </div>
                    </div>
                  ) : (
                    <div
                      classname="userprofile__container__header__info__follow-container__follow"
                      onClick={() => dispatch(followUserAction(id))}
                    >
                      <div className="userprofile__container__header__info__follow-container__follow__icon">
                        <RiUserFollowLine />
                      </div>

                      <div className="userprofile__container__header__info__follow-container__follow__text">
                        Follow
                      </div>
                    </div>
                  )}
                </div>
                {!isLoginUser ? (
                  <div className="userprofile__container__header__info__message-container">
                    <div
                      className="userprofile__container__header__info__message-container__button"
                      onClick={sendMailHandler}
                    >
                      <IoMailOutline className="userprofile__container__header__info__message-container__icon" />

                      <div className="userprofile__container__header__info__message-container__button__text">
                        Nachricht senden
                      </div>
                    </div>
                  </div>
                ) : null}

                {isLoginUser ? (
                  <Link to="update-passsword">
                    <div className="userprofile__container__header__info__update-password-container">
                      <div className="userprofile__container__header__info__message-container__icon">
                        <RiLockPasswordLine />
                      </div>
                      Passwort updaten
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          </>
        )}
        <div className="userprofile__container__posts">
          <h1 className="userprofile__container__posts__title">
            {profile?.posts.length === 1
              ? "Meine Gallerie"
              : profile?.posts.length === 0
              ? "Keine Posts gefunden"
              : "Meine Gallery"}
          </h1>
          {isLoginUser ? (
            <Link
              className="userprofile__container__posts__button"
              to="/create-post"
            >
              <MdAddCircle className="userprofile__container__posts__button__icon" />
              <span className="post-list__cta__add__text">Post hinzufügen</span>
            </Link>
          ) : null}
          <div className="userprofile__container__posts__container">
            {profile?.posts.map((post) => {
              return (
                <PostCard
                  profilePicture={profile?.profilePicture}
                  key={post?._id}
                  post={post}
                  comments={post?.comments}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="userprofile__followers__container">
        <div className="userprofile__followers__container__followers"></div>
        <div className="userprofile__followers__container__following"></div>
      </div>
    </div>
  );
};

export default Profile;
