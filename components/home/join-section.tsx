import Link from "next/link";
import { Icon } from "../../app/ui";
export default function JoinSection() {
  return (
    <>
      <section className="clone-section clone-join">
        <div>
          <h2>Join Vantora to grow your business today!</h2>
          <p>
            Discover products, make connections and plan your logistics in one
            place.
          </p>
          <div>
            <Link href="/auth/sign-up/buyer" className="primary">
              Join now <Icon name="arrow" size={19} />
            </Link>
            <Link href="/market-promo" className="clone-link-button">
              Become a supplier <Icon name="arrow" size={19} />
            </Link>
          </div>
        </div>
        <div className="join-free-mark" aria-hidden="true">
          <span>100%</span>
          <strong>FREE</strong>
        </div>
      </section>
      <section className="clone-market-intro">
        <h2>The B2B marketplace you were looking for</h2>
        <p>
          Our B2B wholesale marketplace will help your business prosper. Every
          day we improve the platform to make it a marketplace B2B sellers and
          buyers can count on. Come for new clients and profitable deals, for
          direct business connections, and for useful industry insights.
        </p>
        <p>
          Vantora is a B2B marketplace platform intended to help wholesale traders
          find new buyers or suppliers on the global market. We aim to make
          international trade simpler and more efficient. Vantora is an online B2B
          marketplace platform accessible to everyone. We cover all the
          countries and industries.
        </p>
        <p>
          Become a supplier on our platform to provide your company with higher
          visibility on the internet, to bring in more customers and boost
          sales.
        </p>
      </section>
    </>
  );
}
