import {collection, doc, getDoc, setDoc, getDocs, updateDoc, orderBy, query, writeBatch} from "firebase/firestore";
import { newDb } from "@/firebase"; // your Firebase initialization

export const createTags = async () => {
    const tags = [
        "AI", "Machine Learning", "Automation", "LLM", "Laravel",
        "PHP", "NodeJS", "React", "Vue", "JavaScript", "Frontend",
        "Backend", "UI-UX", "Design", "Animation", "Testing", "TDD",
        "Debugging", "Profiling", "Tooling", "Security", "Embedded Devices",
        "Game Development", "C++", "Documentation", "Team Culture"
    ]
    const batch = writeBatch(newDb);
    tags.forEach(tag => {
        const tagRef = doc(newDb, 'tags', tag);
        batch.set(tagRef, { description: tag, usageCount: 0 });
    });
    await batch.commit();
    console.log('Tags created successfully.');
};

export const insertNewTagIfNeeded = async (tag: string) => {
    const tagDocRef = doc(newDb, "tags", tag);
    const docSnap = await getDoc(tagDocRef);
    if (!docSnap.exists()) {
       await setDoc(tagDocRef, { description: tag, usageCount: 0 })
       console.log(`New tag ${tag} is inserted`)
    }
}

export const insertTagsForPastTalk = async (talk: any, tags: string[]) => {
    const talkToUpdate = doc(newDb, "tech-talks", talk.id)

    await updateDoc(talkToUpdate, {
        tags: tags
    })
}

export async function getTalks() {
    const talksCollection = collection(newDb, "tech-talks");

    const q = query(talksCollection, orderBy('createdAt', 'desc'))
    let allTalks;
    try {
        allTalks = await getDocs(q);
    } catch (e) {
        console.log(e)
    }

    return allTalks?.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toDateString()
    }));

}

export async function getTags() {
    const tagsCollection = collection(newDb, "tags");

    const q = query(tagsCollection, orderBy('description','asc'))
    const allTags = await getDocs(q);

    return allTags.docs.map((tag) => tag.id);
}

export async function getVideoLinks() {
    const tagsCollection = collection(newDb, "video-links");
    const snapshot = await getDocs(tagsCollection);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}