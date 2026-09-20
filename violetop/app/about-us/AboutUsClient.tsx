import Image from "next/image";
import MemberPortrait from "../components/MemberPortrait";
import PageShell from "../components/PageShell";
import { aboutContent, type MemberImage } from "../data/siteContent";
import styles from "./AboutUs.module.css";

type DirectoryPerson = {
  name: string;
  image?: MemberImage;
  roles: string[];
};

function buildDirectory() {
  const people: DirectoryPerson[] = [];
  const byIdentity = new Map<string, DirectoryPerson>();

  aboutContent.sections.forEach((section, sectionIndex) => {
    section.people.forEach((entry, entryIndex) => {
      if (entry.name === "TBA") return;

      const image = "image" in entry ? entry.image : undefined;
      // A repeated name is merged only when the same portrait confirms the identity.
      const identity = image ? `${entry.name}::${image.src}` : `${sectionIndex}::${entryIndex}`;
      let person = byIdentity.get(identity);
      if (!person) {
        person = { name: entry.name, image, roles: [] };
        byIdentity.set(identity, person);
        people.push(person);
      }

      entry.role.split(/\s+\/\s+/).forEach((role) => {
        if (!person.roles.includes(role)) person.roles.push(role);
      });
    });
  });

  return people;
}

export default function AboutUsClient() {
  const people = buildDirectory();

  return (
    <PageShell>
      <div className={styles.wrap}>
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>The People Behind Violet OP</p>
            <h1>{aboutContent.title}</h1>
            <p>{aboutContent.paragraphs[0]}</p>
          </div>
          <div className={styles.introPhoto}>
            <Image alt="Violet OP members together at a team gathering" fill priority quality={75} sizes="(max-width: 760px) 100vw, 42vw" src={aboutContent.image} />
          </div>
        </header>

        <section aria-labelledby="directory-heading" className={styles.directory}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>One Team, Many Roles</p>
            <h2 id="directory-heading">People Directory</h2>
            <p>Meet the people who lead, organize, create, and compete with Violet OP. Leadership is listed first; the remaining order does not imply rank.</p>
          </div>
          <div className={styles.peopleGrid}>
            {people.map((person, index) => (
              <article className={styles.personCard} key={`${person.name}-${person.image?.src ?? index}`}>
                <MemberPortrait image={person.image} name={person.name} />
                <div className={styles.personInfo}>
                  <h3>{person.name}</h3>
                  <ul aria-label={`${person.name}'s roles`}>
                    {person.roles.map((role) => <li key={role}>{role}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </PageShell>
  );
}
