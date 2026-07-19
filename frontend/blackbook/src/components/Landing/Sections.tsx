import type { JSX } from "react";

export function LandingSections(): JSX.Element {
  return (
    <main className="px-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mt-12">
      <section className="mt-4 md:col-start-1 md:col-end-2">
        <h2 className="text-3xl md:text-4xl mb-2">Why BlackBook?</h2>
        <p className="relative max-w-xl mx-auto text-base sm:text-lg text-neutral-200 leading-relaxed">
          BlackBook is a social media platform built to connect communities,
          spark authentic conversations, and give creators total control over
          their digital space.
        </p>
      </section>
      <section className="mt-4 md:col-start-2 md:col-end-3">
        <h2 className="text-3xl md:text-4xl mb-2">Features</h2>
        <ul className="px-4 list-decimal text-base sm:text-lg text-neutral-200 leading-relaxed">
          <li className="flex items-center gap-2">
            <span className="text-blue-500">✓</span> Share your story with
            high-quality text and image posts.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">✓</span> Personalize your digital
            space with custom profiles and avatars.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">✓</span> Build meaningful
            connections through a dynamic follower network.
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">✓</span> Spark conversations with
            instant post interactions, likes, and comments.
          </li>
        </ul>
      </section>
    </main>
  );
}
