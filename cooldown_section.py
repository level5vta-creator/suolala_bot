import time

COOLDOWN_SECONDS = 10 * 60
user_last_generation = {}
is_generating = set()


async def generate_command(update, context):
    user_id = update.effective_user.id
    now = time.time()
    last_time = user_last_generation.get(user_id)
    diff = (now - last_time) if last_time is not None else None

    print(f"[COOLDOWN] user_id={user_id}")
    print(f"[COOLDOWN] last_time={last_time}")
    print(f"[COOLDOWN] now={now}")
    print(f"[COOLDOWN] diff={diff}")

    if last_time is not None and diff < COOLDOWN_SECONDS:
        remaining_seconds = int(COOLDOWN_SECONDS - diff)
        remaining_minutes = max(1, (remaining_seconds + 59) // 60)
        await update.message.reply_text(
            f"⏳ Please wait {remaining_minutes} minute(s) before using /generate again."
        )
        return

    if user_id in is_generating:
        await update.message.reply_text("🛠 Your previous generation is still in progress. Please wait.")
        return

    is_generating.add(user_id)
    try:
        # --- your existing generation logic here ---
        # result = await generate_image(...)
        # await update.message.reply_photo(photo=result)

        # Save cooldown ONLY after successful generation.
        user_last_generation[user_id] = time.time()
        print(f"[COOLDOWN] saved user_last_generation[{user_id}]={user_last_generation[user_id]}")

    except Exception as e:
        print(f"[GENERATE] error for user_id={user_id}: {e}")
        await update.message.reply_text("❌ Generation failed. Please try again.")
    finally:
        is_generating.discard(user_id)
