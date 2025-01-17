import type { FunctionComponent } from "react";
import { classNames } from "@/utils/helpers";
import getConfig from "next/config";
import Link from "next/link";

const {
	publicRuntimeConfig: { version },
} = getConfig();

interface DisclosureProps {
	className?: string;
}

const Footer: FunctionComponent<DisclosureProps> = ({ className }: DisclosureProps) => {
	return (
		<footer
			className={classNames(
				className,
				"pt-10 footer w-full font-inter opacity-[60%] z-10 text-center text-[12px] mx-auto text-white py-1"
			)}
		>
			Made with <span className="disclosure-symbol">&lt;/&gt;</span> & ♥ @ ACM UTSA |{" "}
			<a href="https://forms.gle/eqj1gMRRhZKitAn47" target={"_blank"} className="underline">
				Report a Bug
			</a>{" "}
			{version != undefined ? (
				<>
					|{" "}
					<Link className="underline" href="https://github.com/UTSA-ACM/Portal">
						v{version}
					</Link>
				</>
			) : null}{" "}
			|{" "}
			<Link href="/terms-of-service" className="underline">
				TOS
			</Link>
			<br />© The Association for Computing Machinery at UTSA {new Date().getFullYear()}. All Rights
			Reserved.
		</footer>
	);
};

export default Footer;
