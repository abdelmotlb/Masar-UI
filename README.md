## File Storage Strategy

Attachments should be stored using a hybrid approach based on their size.

- Small files should be stored directly in the database as BLOBs.
- Once a file exceeds a predefined size limit, it should be stored externally (filesystem, cloud storage, network storage, etc.), while only its reference (path, URL, or storage key) is stored in the database.

This approach keeps the database size manageable while maintaining good performance and scalability.

> **Note:** According to the SQLite documentation, storing BLOBs smaller than approximately **100 KB** inside the database is generally more efficient, while larger files are typically better stored externally.
>
> Reference: https://www.sqlite.org/intern-v-extern-blob.html