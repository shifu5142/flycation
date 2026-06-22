"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  CreditCard,
  Download,
  FileText,
  Headphones,
  Info,
  Luggage,
  Mail,
  MapPin,
  Phone,
  Plane,
  QrCode,
  Share2,
  Shield,
  Ticket,
  Users,
  Utensils,
  Wifi,
  XCircle,
} from "lucide-react";

import { DashboardShell } from "@/components/Sidebar";
import { AppImage } from "@/components/AppImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  statusLabels,
  type Booking,
  type BookingStatus,
} from "@/lib/mockBookingsPage";
import { statusBadgeClass } from "@/lib/tripBooking";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

function bookingIcon(type: Booking["type"]) {
  if (type === "flight") return Plane;
  if (type === "hotel") return Building2;
  return Ticket;
}

function parseRoute(title: string) {
  const parts = title.split("→").map((s) => s.trim());
  return {
    from: parts[0] ?? title,
    to: parts[1] ?? "Destination",
  };
}

function parseSubtitle(subtitle: string) {
  const parts = subtitle.split("·").map((s) => s.trim());
  return {
    carrier: parts[0] ?? "FlyCation",
    travelClass:
      parts.find((p) => /economy|business|first|premium/i.test(p)) ??
      parts[1] ??
      "Economy",
    tripType:
      parts.find((p) => /round|one way|non-stop|stop/i.test(p)) ??
      (subtitle.toLowerCase().includes("round") ? "Round trip" : "One way"),
  };
}

const statusOptions: {
  status: "booked" | "pending" | "cancelled";
  icon: typeof Check;
  label: string;
}[] = [
  { status: "booked", icon: Check, label: "Booked" },
  { status: "pending", icon: Clock, label: "Pending" },
  { status: "cancelled", icon: XCircle, label: "Cancelled" },
];

export default function MyBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(
    null,
  );
  console.log(bookingStatus);
  const { toast } = useToast();
  useEffect(() => {
    if (!bookingStatus) return;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("trips")
        .update({
          booking_status: bookingStatus,
        })
        .eq("id", params.id);
      if (error) {
        console.error(error);
      }
      if (data) {
          toast("Booking status updated", "success");
      }
    })();
  }, [bookingStatus]);
  const booking = useMemo(() => {
    const raw = searchParams.get("data");
    if (!raw) return null;

    try {
      const parsed = JSON.parse(decodeURIComponent(raw)) as Booking;
      if (parsed.id !== params.id) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [searchParams, params.id]);

  useEffect(() => {
    if (booking) setBookingStatus(booking.status);
  }, [booking]);

  const activeStatus = bookingStatus ?? booking?.status ?? "pending";

  const route = booking ? parseRoute(booking.title) : null;
  const meta = booking ? parseSubtitle(booking.subtitle) : null;
  const travelerNames = booking
    ? Array.from({ length: booking.travelers }, (_, i) => `Traveler ${i + 1}`)
    : [];

  const baseFare =
    booking && booking.price > 0 ? Math.round(booking.price * 0.82) : 0;
  const taxes = booking && booking.price > 0 ? booking.price - baseFare : 0;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl space-y-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl" asChild>
            <Link href="/my-bookings">
              <ArrowLeft className="size-4" />
              Back to bookings
            </Link>
          </Button>
          {booking && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Share2 className="size-3.5" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <CalendarPlus className="size-3.5" />
                Add to calendar
              </Button>
            </div>
          )}
        </div>

        {!booking || !route || !meta ? (
          <Card className="rounded-2xl border-dashed py-16 text-center">
            <CardContent>
              <p className="font-medium">Booking not found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Open this page from My Bookings to view trip details.
              </p>
              <Button className="mt-6 rounded-xl" asChild>
                <Link href="/my-bookings">Return to My Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-sm">
              <div className="relative h-64 sm:h-80">
                <AppImage
                  src={booking.image}
                  alt={booking.title}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <Badge
                  className={cn(
                    "absolute top-4 left-4 border backdrop-blur-sm",
                    statusBadgeClass(activeStatus),
                  )}
                >
                  {statusLabels[activeStatus]}
                </Badge>
                <Badge className="absolute top-4 right-4 border border-white/20 bg-black/40 text-white backdrop-blur-sm">
                  {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                </Badge>
                <div className="absolute right-4 bottom-4 left-4 text-white">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                      {(() => {
                        const Icon = bookingIcon(booking.type);
                        return <Icon className="size-5" />;
                      })()}
                    </span>
                    <div>
                      <h1 className="text-2xl font-bold sm:text-4xl">
                        {booking.title}
                      </h1>
                      <p className="mt-0.5 text-sm text-white/90 sm:text-base">
                        {booking.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Booking reference
                  </p>
                  <p className="font-mono text-lg font-semibold">
                    {booking.reference}
                  </p>
                </div>
                <Separator
                  orientation="vertical"
                  className="hidden h-10 sm:block"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Confirmation</p>
                  <p className="text-sm font-medium">
                    {activeStatus === "confirmed"
                      ? "E-ticket issued"
                      : activeStatus === "pending"
                        ? "Processing"
                        : "Cancelled"}
                  </p>
                </div>
                <Separator
                  orientation="vertical"
                  className="hidden h-10 sm:block"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Booked on</p>
                  <p className="text-sm font-medium">
                    {booking.timeline[0]?.date ?? booking.dates}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="h-auto rounded-xl px-5 py-4 lg:self-center"
              >
                <Download className="size-4" />
                Download invoice
              </Button>
            </div>

            <Card className="overflow-hidden rounded-2xl border-border/60">
              <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
                <CardTitle className="text-lg">Itinerary overview</CardTitle>
                <CardDescription>
                  {meta.carrier} · {meta.travelClass} · {meta.tripType}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr]">
                  <div className="space-y-2 p-6 md:text-right">
                    <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                      Departure
                    </p>
                    <p className="text-2xl font-bold">{route.from}</p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground md:justify-end">
                      <CalendarDays className="size-3.5" />
                      {booking.dates.split("–")[0]?.trim() ?? booking.dates}
                    </p>
                    {booking.time && (
                      <p className="flex items-center gap-1.5 text-sm font-medium md:justify-end">
                        <Clock className="size-3.5 text-primary" />
                        {booking.time.split("–")[0]?.trim()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2 border-y border-border/60 bg-muted/10 px-6 py-8 md:border-x md:border-y-0">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Plane className="size-5 rotate-90 md:rotate-0" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {meta.tripType}
                    </p>
                    <div className="hidden items-center gap-2 md:flex">
                      <div className="h-px w-8 bg-border" />
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <div className="h-px w-8 bg-border" />
                    </div>
                  </div>

                  <div className="space-y-2 p-6">
                    <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                      Arrival
                    </p>
                    <p className="text-2xl font-bold">{route.to}</p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {booking.dates.includes("–")
                        ? booking.dates.split("–")[1]?.trim()
                        : booking.dates}
                    </p>
                    {booking.time && (
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock className="size-3.5 text-primary" />
                        {booking.time.split("–")[1]?.trim() ?? booking.time}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: MapPin, label: "Route", value: booking.title },
                {
                  icon: CalendarDays,
                  label: "Travel dates",
                  value: booking.dates,
                },
                {
                  icon: Users,
                  label: "Passengers",
                  value: `${booking.travelers} traveler${booking.travelers !== 1 ? "s" : ""}`,
                },
                { icon: Plane, label: "Class", value: meta.travelClass },
                { icon: Ticket, label: "Carrier", value: meta.carrier },
                {
                  icon: Clock,
                  label: "Schedule",
                  value: booking.time ?? "See itinerary",
                },
                {
                  icon: Shield,
                  label: "Protection",
                  value: "Travel insurance included",
                },
                {
                  icon: Luggage,
                  label: "Baggage",
                  value: "1 checked · 1 carry-on",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.label}
                    className="rounded-2xl border-border/60"
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="truncate font-semibold">{item.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="size-5 text-primary" />
                    Travelers
                  </CardTitle>
                  <CardDescription>
                    Passenger details for this reservation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {travelerNames.map((name, index) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            Adult · {meta.travelClass}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        Seat {String.fromCharCode(65 + (index % 6))}
                        {12 + index}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Luggage className="size-5 text-primary" />
                    Included services
                  </CardTitle>
                  <CardDescription>
                    What&apos;s covered with your booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      icon: Luggage,
                      label: "Checked bag",
                      detail: "23 kg per person",
                    },
                    {
                      icon: Utensils,
                      label: "Meals",
                      detail: "Complimentary on board",
                    },
                    { icon: Wifi, label: "Wi-Fi", detail: "Messaging package" },
                    {
                      icon: Shield,
                      label: "Flex fare",
                      detail: "Date change allowed",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-start gap-3 rounded-xl border border-border/60 p-3"
                      >
                        <Icon className="mt-0.5 size-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Trip status</CardTitle>
                    <CardDescription className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {booking.dates}
                      {booking.time ? ` · ${booking.time}` : ""}
                      {" · "}
                      {booking.travelers} traveler
                      {booking.travelers !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(({ status, icon: Icon, label }) => (
                      <Button
                        key={status}
                        type="button"
                        variant={
                          activeStatus === status ? "default" : "outline"
                        }
                        size="sm"
                        className={cn(
                          "rounded-xl",
                          activeStatus === status && statusBadgeClass(status),
                        )}
                        onClick={() =>
                          setBookingStatus(status as BookingStatus)
                        }
                      >
                        <Icon className="size-3.5" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-0">
                  {booking.timeline.map((step, index) => (
                    <div key={step.label} className="flex items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-9 items-center justify-center rounded-full border text-sm font-semibold",
                            step.done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted text-muted-foreground",
                          )}
                        >
                          {step.done ? <Check className="size-4" /> : index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{step.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {step.date}
                          </p>
                        </div>
                      </div>
                      {index < booking.timeline.length - 1 && (
                        <div
                          className={cn(
                            "mx-3 hidden h-px w-10 sm:block lg:w-16",
                            step.done ? "bg-primary/40" : "bg-border",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="flex items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-5 py-4">
                    <div className="flex size-20 items-center justify-center rounded-lg border border-border bg-background">
                      <QrCode className="size-14 text-foreground/80" />
                    </div>
                    <div>
                      <p className="font-medium">Mobile boarding pass</p>
                      <p className="text-sm text-muted-foreground">
                        Ref {booking.reference} · Show at gate
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {booking.id.padStart(8, "0").slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    <Button
                      size="lg"
                      className="rounded-xl"
                      disabled={activeStatus === "cancelled"}
                    >
                      Check in online
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-xl">
                      <Download className="size-4" />
                      Save boarding pass
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="size-5 text-primary" />
                    Payment summary
                  </CardTitle>
                  <CardDescription>
                    Charges for this reservation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {booking.price > 0 ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base fare</span>
                        <span>${baseFare}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Taxes & fees
                        </span>
                        <span>${taxes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Seat selection
                        </span>
                        <span>Included</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total paid</span>
                        <span className="text-primary">${booking.price}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Reservation
                        </span>
                        <span>Confirmed</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Payment status
                        </span>
                        <span>No charge on file</span>
                      </div>
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        Pricing details will appear once payment is linked to
                        this booking.
                      </p>
                    </>
                  )}
                  <Button variant="outline" className="mt-2 w-full rounded-xl">
                    <FileText className="size-4" />
                    View receipt
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="size-5 text-primary" />
                    Travel documents
                  </CardTitle>
                  <CardDescription>
                    Download or print before you go
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "E-ticket confirmation", size: "PDF · 245 KB" },
                    { label: "Itinerary receipt", size: "PDF · 180 KB" },
                    { label: "Travel insurance policy", size: "PDF · 92 KB" },
                  ].map((doc) => (
                    <button
                      key={doc.label}
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="size-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{doc.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.size}
                          </p>
                        </div>
                      </div>
                      <Download className="size-4 text-muted-foreground" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="size-5 text-primary" />
                  Important information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {[
                  "Arrive at the airport at least 3 hours before international departures.",
                  "Valid passport required — check expiry date before travel.",
                  "Online check-in opens 24 hours before departure.",
                  activeStatus === "cancelled"
                    ? "This booking has been cancelled. Contact support for rebooking options."
                    : "Free cancellation within 24 hours of booking for eligible fares.",
                ].map((note) => (
                  <div
                    key={note}
                    className="flex gap-2 rounded-xl bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                  >
                    <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p>{note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Headphones className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      Need help with this booking?
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Our support team is available 24/7 for changes, refunds,
                      and special assistance.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Phone className="size-3.5 text-primary" />
                        +1 (800) 555-FLY
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Mail className="size-3.5 text-primary" />
                        support@flycation.com
                      </span>
                    </div>
                  </div>
                </div>
                <Button className="shrink-0 rounded-xl">Contact support</Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
