import { profileData } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2025 {profileData.name}. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          寻找2027年暑期实习机会
        </p>
      </div>
    </footer>
  );
}
