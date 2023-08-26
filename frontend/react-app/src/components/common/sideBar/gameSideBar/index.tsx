import { ButtonList, IconButtonProps } from "@src/components/buttons";
import * as S from "../index.styled";
import RateDoughnutChart from "@src/components/charts/rateDoughnutChart";
import { useRecoilState } from "recoil";
import { userDataState } from "@src/recoil/atoms/common";

const GameSideBar = () => {
  const [userData] = useRecoilState(userDataState);
  const iconButtons: IconButtonProps[] = [
    {
      title: "방 만들기",
      iconSrc: "",
      onClick: () => {
        console.log("방 만들기");
      },
      theme: "LIGHT",
    },
    {
      title: "랭킹전 참가",
      iconSrc: "",
      onClick: () => {
        console.log("랭킹전 참가");
      },
      theme: "LIGHT",
    },
    {
      title: "둘러보기",
      iconSrc: "",
      onClick: () => {
        console.log("둘러보기");
      },
      theme: "LIGHT",
    },
  ];

  return (
    <S.Container>
      <ButtonList buttons={iconButtons} />
      <br />
      <RateDoughnutChart userData={userData} />
    </S.Container>
  );
};

export default GameSideBar;
