import { BookCheckIcon, Globe2Icon, YoutubeIcon } from "lucide-react";
import logo from "@/public/logo.png";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <>
      <Separator />
      <div className="text-center px-8 pb-8 mt-2 lg:mt-8">
        <a
          href="#"
          className="flex items-center justify-center mb-5 text-2xl font-semibold"
        >
          <img src={logo} alt="ABN Logo" width={25} height={25} />
          TABN
        </a>
        <span className="block text-sm text-center">
          © 2025 HrushiSpace™. Developed by
          <a
            href="https://hrushispace.com"
            className="hover:underline text-primary font-bold"
          >
            {" "}
            Hrushikesh Kothem
          </a>{" "}
        </span>
        <ul className="flex justify-center mt-5 space-x-5">
          <li>
            <a href="https://hrushispace.com">
              <Globe2Icon size={24} />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@hrushispace">
              <YoutubeIcon size={24} />
            </a>
          </li>
          <li>
            <a href="/terms">
              <BookCheckIcon size={24} />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
