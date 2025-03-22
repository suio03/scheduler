import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountsList } from "@/components/accounts/accounts-list";
import { AccountsEmptyState } from "@/components/accounts/accounts-empty-state";
import { AccountsListSkeleton } from "@/components/accounts/accounts-list-skeleton";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Accounts");
  
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AccountsPage() {
  const t = await getTranslations("Accounts");
  
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      
      <Suspense fallback={<AccountsListSkeleton />}>
        <AccountsList fallback={<AccountsEmptyState />} />
      </Suspense>
    </div>
  );
} 