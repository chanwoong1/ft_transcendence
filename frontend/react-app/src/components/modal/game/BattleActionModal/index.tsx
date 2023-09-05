import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { battleActionModalState } from "@src/recoil/atoms/modal";
import * as S from "./index.styled";
import { IconButton } from "@src/components/buttons";
import { UserType } from "@src/types";
import { useNavigate } from "react-router-dom";
import { userDataState } from "@src/recoil/atoms/common";
import { acceptBattle, rejectBattle } from "@src/api/game";
import { gameRoomInfoState } from "@src/recoil/atoms/game";
import { gameSocket } from "@src/router/socket/gameSocket";

const BattleActionModal = () => {
  const [battleActionModal, setBattleActionModal] = useRecoilState(
    battleActionModalState,
  );
  const [userData, setUserData] = useRecoilState(userDataState);
  // const [showProfile, setShowProfile] = useRecoilState(showProfileState);
  const [gameRoomInfo, setGameRoomInfo] = useRecoilState(gameRoomInfoState);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);
  const [countdownInterval, setCountdownInterval] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (battleActionModal) {
      setCountdown(5);
      startCountdown();
    }
  }, [battleActionModal]);

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(interval);
          closeModal(); // 모달 닫기 함수 호출
        }
        return prevCountdown - 1;
      });
    }, 1000);
    setCountdownInterval(interval);
  };

  const closeModal = async () => {
    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
    }
    await handleCancelButton();
  };

  const handleCancelButton = async () => {
    // 대전 신청 거절 api 호출
    await rejectBattle(
      battleActionModal.awayUser,
      battleActionModal.gameRoomURL,
    );
    setBattleActionModal({
      battleActionModal: false,
      awayUser: {} as UserType,
      gameRoomURL: "",
    }); // 모달 닫기
  };

  const handleAcceptButton = () => {
    const gameRoomURL = battleActionModal.gameRoomURL;
    console.log("gameRoomURL", gameRoomURL);
    gameSocket.emit("acceptBattle", {
      gameRoomURL: gameRoomURL,
    });
    setUserData({
      ...userData,
      gameRoomURL: gameRoomURL,
    });
    setBattleActionModal({
      battleActionModal: false,
      awayUser: {} as UserType,
      gameRoomURL: "",
    }); // 모달 닫기
    // 대전 신청 수락 시 대전 페이지로 이동
    // window.location.href = `/game/${gameRoomURL}`;
  };

  useEffect(() => {
    console.log("battleActionModal", battleActionModal);
  });

  return (
    <S.ModalWrapper>
      <S.Container>
        <S.Title>
          {" "}
          {battleActionModal.awayUser.nickname}님 께서 대전을 신청하셨습니다.
        </S.Title>
        <S.Title>{countdown}</S.Title>
        <S.ButtonContainer>
          <IconButton title="거절" theme="LIGHT" onClick={handleCancelButton} />
          <IconButton title="참여" theme="LIGHT" onClick={handleAcceptButton} />
        </S.ButtonContainer>
      </S.Container>
    </S.ModalWrapper>
  );
};

export default BattleActionModal;
