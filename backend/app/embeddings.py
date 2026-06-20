import chromadb
from pdf_chunking import chunks

# Step 1: Setting up the chroma client
chroma_client = chromadb.Client()

# Step 2: Creating or getting the same collection
collection = chroma_client.get_or_create_collection(name="pdf-embeddings")

# Step 2: Adding chunks to the collection through upsert (avoids adding the same docs)
collection.upsert(
    documents=chunks,
    ids=[f"doc_{i}" for i in range(len(chunks))]
)

# Step 3: Querying the collection
results = collection.query(
    query_texts=["What is the document about?"],
    n_results=3 # how many results to return
)

print(f'Results: {results}')