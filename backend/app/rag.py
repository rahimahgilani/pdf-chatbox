import chromadb
from groq import Groq
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings 
from langchain.messages import HumanMessage

# Step 1: Load dotenv file and embeddings
load_dotenv()

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Step 2: Setting up the chroma client
client = chromadb.PersistentClient(path="../data/chroma_db")

# Step 3: Create a collection in the chroma client
vector_store = Chroma(
    collection_name="pdf-embeddings",
    embedding_function=embeddings,
    persist_directory="../data/chroma_db",
)

# Step 3: Querying the collection by turning it into a retriever
retriever = vector_store.as_retriever(
    search_type="mmr", search_kwargs={"k": 1, "fetch_k": 5}
)

question = "What is the summary of the document?"
text = retriever.invoke(question)

print(f"Retrieved text: {text}")
print(f"Number of retrieved documents: {len(text)}")

# Step 4: Convert the retrieved documents into a single string
singleString = " ".join([item.page_content for item in text])

print(f"Single string: {singleString}")

# Step 5: Setting up ChatGroq
llm = ChatGroq(model="meta-llama/llama-4-scout-17b-16e-instruct")

# Step 6: Building a simple prompt template
message = HumanMessage(
    content=[
        {"type": "text", "text": singleString},
        {"type": "text", "text": question},
    ]
)

response = llm.invoke([message])
print(response.content)