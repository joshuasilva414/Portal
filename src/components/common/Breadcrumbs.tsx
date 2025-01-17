import { FunctionComponent } from "react";
import { HiHome, HiChevronRight } from "react-icons/hi";
import Link from "next/link";
import { UrlObject } from "url";

export type Breadcrumb = {
	label: string;
	href?: string | UrlObject;
	active?: boolean;
};

declare type BreadcrumbProps = {
	value: Breadcrumb[];
};

const Breadcrumbs: FunctionComponent<BreadcrumbProps> = ({ value }) => {
	return (
		<nav className="flex" aria-label="Breadcrumb">
			<ol role="list" className="flex items-center space-x-3">
				<li>
					<div>
						<a href="#" className="text-gray-400 hover:text-gray-500">
							<HiHome className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
							<span className="sr-only">Home</span>
						</a>
					</div>
				</li>
				{value.map((crumb) => {
					return (
						<li key={crumb.label}>
							<div className="flex items-center max-w-full">
								<HiChevronRight
									className="mr-3 mt-0.5 flex-shrink-0 h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
								{<Link
									href={crumb.href ?? "#"} // TODO: Proper undefined href handling
									className="text-sm font-medium text-gray-500 hover:text-gray-700 overflow-ellipsis whitespace-nowrap"
									aria-current={crumb.active ? "page" : undefined}
								>
									{crumb.label}
								</Link>}
							</div>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
