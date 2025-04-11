import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

interface CourseCardProps {
  title: string;
  provider: string;
  providerLogo: string;
  coverImage: string;
  href: string;
  description: string;
  status: string;
  slug?: string;
}

export function CourseCard({
  title,
  provider,
  providerLogo,
  coverImage,
  href,
  description,
  status,
  slug,
}: CourseCardProps) {
  // Link to detailed course page if slug exists, otherwise to external course URL
  const linkHref = slug ? `/courses/${slug}` : href;
  const isExternal = !slug;

  return (
    <Card className="flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full">
      <Link 
        href={linkHref} 
        className="block cursor-pointer" 
        target={isExternal ? "_blank" : undefined}
      >
        <div className="relative h-40 w-full">
          <Image
            src={coverImage}
            alt={title}
            width={500}
            height={300}
            className="h-full w-full overflow-hidden object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={status === "Completed" ? "default" : "secondary"}>
              {status}
            </Badge>
          </div>
        </div>
      </Link>
      <CardHeader className="px-4 pb-2">
        <div className="flex justify-between items-center">
          <Link 
            href={linkHref}
            target={isExternal ? "_blank" : undefined}
            className="hover:underline"
          >
            <CardTitle className="text-base">{title}</CardTitle>
          </Link>
          <Avatar className="size-8 border bg-white">
            <AvatarImage
              src={providerLogo}
              alt={provider}
              className="object-contain p-1"
            />
            <AvatarFallback>{provider[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-xs text-muted-foreground">{provider}</div>
      </CardHeader>
      <CardContent className="px-4 pt-0 flex-grow">
        <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
          {description}
        </Markdown>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <div className="flex flex-wrap gap-1">
        </div>
      </CardFooter>
    </Card>
  );
} 