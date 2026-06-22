import { Container } from "@/components/layout/Container";
import { LoadingState } from "@/components/atoms";

export default function Loading() {
  return (
    <div className="py-12">
      <Container>
        <LoadingState label="Loading tour…" />
      </Container>
    </div>
  );
}
