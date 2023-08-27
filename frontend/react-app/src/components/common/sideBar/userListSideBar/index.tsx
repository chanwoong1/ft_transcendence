import { DoubleTextButtonProps, ButtonList } from "@src/components/buttons";
import * as DS from "../index.styled";
import { useRecoilState } from "recoil";
import { allUserListState } from "@src/recoil/atoms/common";
import { UserStatusCounts } from "@src/types/user.type";

interface UserListSideBarProps {
  onAllUsersClick: () => void;
  onFriendsClick: () => void;
  onOnlineClick: () => void;
  onGamingClick: () => void;
  onOfflineClick: () => void;
  userStatusCounts: UserStatusCounts;
}

const UserListSideBar: React.FC<UserListSideBarProps> = ({
  onAllUsersClick,
  onFriendsClick,
  onOnlineClick,
  onGamingClick,
  onOfflineClick,
  userStatusCounts,
}) => {
  const [allUserList] = useRecoilState(allUserListState);

  // TODO: text2에 "0"인 경우는 추가 구현 사항
  const userButtonList: DoubleTextButtonProps[] = [
    {
      text1: "전체",
      text2: `${allUserList.length.toString()}`,
      onClick: onAllUsersClick,
      theme: "LIGHT",
    },
    {
      text1: "친구",
      text2: `${userStatusCounts.friendCount.toString()}`,
      onClick: onFriendsClick,
      theme: "LIGHT",
    },
  ];

  const userStatusButtonList: DoubleTextButtonProps[] = [
    {
      text1: "온라인",
      text2: `${userStatusCounts.onlineCount.toString()}`,
      onClick: onOnlineClick,
      theme: "LIGHT",
    },
    {
      text1: "게임중",
      text2: `${userStatusCounts.gamingCount.toString()}`,
      onClick: onGamingClick,
      theme: "LIGHT",
    },
    {
      text1: "오프라인",
      text2: `${userStatusCounts.offlineCount.toString()}`,
      onClick: onOfflineClick,
      theme: "LIGHT",
    },
  ];

  return (
    <DS.Container style={{ gap: "20px" }}>
      <DS.TitleBox>사용자 둘러보기</DS.TitleBox>
      <ButtonList style={{ gap: "20px" }} buttons={userButtonList} />
      <DS.TitleBox>접속 현황</DS.TitleBox>
      <ButtonList style={{ gap: "20px" }} buttons={userStatusButtonList} />
    </DS.Container>
  );
};

export default UserListSideBar;
