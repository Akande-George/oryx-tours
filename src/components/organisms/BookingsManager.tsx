import { ActionButton } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingCard } from "@/components/molecules/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBookings } from "@/lib/mock-data";
import { BookingDetailsDialog } from "@/components/organisms/BookingDetailsDialog";

type BookingsManagerProps = {
  title: string;
  subtitle: string;
};

const tabDefinitions = [
  {
    value: "upcoming",
    label: "Upcoming",
    bookings: mockBookings.filter((booking) => booking.status === "Upcoming"),
  },
  {
    value: "completed",
    label: "Completed",
    bookings: mockBookings.filter((booking) => booking.status === "Completed"),
  },
  {
    value: "cancelled",
    label: "Cancelled",
    bookings: mockBookings.filter((booking) => booking.status === "Cancelled"),
  },
] as const;

export function BookingsManager({ title, subtitle }: BookingsManagerProps) {
  return (
    <div className="space-y-8">
      <SectionHeading title={title} subtitle={subtitle} />

      <Tabs defaultValue="upcoming">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3">
          {tabDefinitions.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabDefinitions.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {tab.bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <BookingDetailsDialog />
        <ActionButton
          label="Download receipts"
          variant="outline"
          className="rounded-full"
          action="print"
        />
      </div>
    </div>
  );
}
