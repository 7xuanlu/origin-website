function slugifySectionHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build stable, unique fragment IDs for one article.
 *
 * The first occurrence keeps the existing slug where possible. Later
 * headings that normalize to the same slug receive a deterministic suffix.
 * This also reserves fallback IDs so a non-ASCII heading cannot collide with
 * a later heading whose slug happens to be `section-N`.
 */
export function buildSectionIds(headings: readonly string[], explicitIds: readonly (string | undefined)[] = []): string[] {
  const usedIds = new Set<string>();
  let implicitIndex = 0;

  return headings.map((heading, index) => {
    const explicitId = explicitIds[index];
    if (!explicitId) implicitIndex += 1;
    const baseId = explicitId || slugifySectionHeading(heading) || `section-${implicitIndex}`;
    let id = baseId;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    return id;
  });
}
