import Image from "next/image";
import PageShell from "../components/PageShell";
import { aboutContent } from "../data/siteContent";
import styles from "./AboutUs.module.css";

type DirectoryPerson = {
  name: string;
  image?: string;
  roles: string[];
};

function buildDirectory() {
  const people: DirectoryPerson[] = [];
  const byIdentity = new Map<string, DirectoryPerson>();
  const unnamedRoles: string[] = [];

  aboutContent.sections.forEach((section, sectionIndex) => {
    section.people.forEach((entry, entryIndex) => {
      if (entry.name === "TBA") {
        unnamedRoles.push(entry.role);
        return;
      }

      const image = "image" in entry ? entry.image : undefined;
      // A repeated name is merged only when the same portrait confirms the identity.
      const identity = image ? `${entry.name}::${image}` : `${sectionIndex}::${entryIndex}`;
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

  return { people, unnamedRoles };
}

export default function AboutUsClient() {
  const { people, unnamedRoles } = buildDirectory();

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
              <article className={styles.personCard} key={`${person.name}-${person.image ?? index}`}>
                <div className={styles.portrait}>
                  {person.image ? (
                    <Image alt={`Portrait of ${person.name}`} fill quality={70} sizes="(max-width: 600px) 45vw, (max-width: 1000px) 28vw, 19vw" src={person.image} />
                  ) : (
                    <span aria-hidden="true">{person.name.split(" ").map((part) => part[0]).join("")}</span>
                  )}
                </div>
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

        {unnamedRoles.length > 0 ? (
          <aside className={styles.unnamed}>
            <h2>Roles Without Named Members</h2>
            <p>The current organization records list these roles without a member name:</p>
            <ul>{unnamedRoles.map((role) => <li key={role}>{role}</li>)}</ul>
          </aside>
        ) : null}
      </div>
    </PageShell>
  );
}
