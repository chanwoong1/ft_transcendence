import {
  LoginButtonContainer,
  LoginButtonImage,
  LoginButtonImageContainer,
  LoginButtonText,
  LoginContainer,
  LoginLogoImage,
  PageContainer,
} from "./index.styled";
import CCPPLogo from "@assets/logos/ccpp_logo.png";
import GoogleLogo from "@assets/logos/google_logo.svg";
import NaverLogo from "@assets/logos/naver_logo.png";
// import FTLogo from "@assets/logos/42_logo.svg";

// const ft_oauth = {
//   base_url: "https://api.intra.42.fr/oauth/authorize",
//   client_id: process.env.VITE_FT_OAUTH_CLIENT_ID as string,
//   redirect_uri: process.env.VITE_FT_OAUTH_REDIRECT_URI as string,
// };

const google_oauth = {
  base_url: "https://accounts.google.com/o/oauth2/v2/auth",
  client_id: process.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string,
  redirect_uri: process.env.VITE_GOOGLE_OAUTH_REDIRECT_URI as string,
};

const naver_oauth = {
  base_url: "https://nid.naver.com/oauth2.0/authorize",
  client_id: process.env.VITE_NAVER_OAUTH_CLIENT_ID as string,
  redirect_uri: process.env.VITE_NAVER_OAUTH_REDIRECT_URI as string,
};

export const LoginButton = ({
  href,
  src,
  type,
}: {
  href: string;
  src: string;
  type: string;
}) => {
  const colorTheme =
    type === "42" ? "#00babc" : type === "Naver" ? "#03C75A" : "#4285f4";

  return (
    <LoginButtonContainer href={href} color={colorTheme}>
      {type === "Naver" ? (
        <LoginButtonImage
          src={src}
          style={{
            width: "46.65px",
            height: "46.65px",
            backgroundColor: "#03C75A",
          }}
        />
      ) : (
        <LoginButtonImageContainer color={colorTheme}>
          <LoginButtonImage src={src} />
        </LoginButtonImageContainer>
      )}
      <LoginButtonText>Sign in With {type}</LoginButtonText>
    </LoginButtonContainer>
  );
};

export default function Login() {
  // const oauth_forty_two = `${ft_oauth.base_url}?client_id=${encodeURIComponent(
  //   ft_oauth.client_id,
  // )}&redirect_uri=${encodeURIComponent(
  //   ft_oauth.redirect_uri,
  // )}&response_type=code`;
  const oauth_google = `${google_oauth.base_url}?client_id=${encodeURIComponent(
    google_oauth.client_id,
  )}&redirect_uri=${encodeURIComponent(
    google_oauth.redirect_uri,
  )}&response_type=code&scope=${encodeURIComponent(
    "https://www.googleapis.com/auth/userinfo.profile",
  )}`;
  const oauth_naver = `${naver_oauth.base_url}?client_id=${encodeURIComponent(
    naver_oauth.client_id,
  )}&response_type=code&redirect_uri=${
    process.env.VITE_BASE_URL
  }${encodeURIComponent(naver_oauth.redirect_uri)}&state=STATE_STRING`;

  return (
    <PageContainer>
      <LoginContainer>
        <LoginLogoImage src={CCPPLogo} />
        {/* <LoginButton href={oauth_forty_two} src={FTLogo} type="42" /> */}
        <LoginButton href={oauth_google} src={GoogleLogo} type="Google" />
        <br />
        <LoginButton href={oauth_naver} src={NaverLogo} type="Naver" />
      </LoginContainer>
    </PageContainer>
  );
}
