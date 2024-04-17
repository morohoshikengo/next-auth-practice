import { getServerSession } from "next-auth";
import { FC, ReactNode } from "react";

interface Props {
  authenticated: ReactNode;
  unauthenticated: ReactNode;
}

const HomeLayout: FC<Props> = async ({ authenticated, unauthenticated }) => {
  // optionsはapiで使用したものを使用する
  const session = await getServerSession();

  return <>{session ? authenticated : unauthenticated}</>;
};

export default HomeLayout;
