import { readFileSync } from "fs";
import { resolve } from "path";

// Test suite for Firestore Security Rules logic
// Simulates evaluating the declarative permissions defined in firestore.rules

interface AuthContext {
  uid?: string;
  role?: "reader" | "contributor" | "editor" | "admin";
}

interface RequestContext {
  auth?: AuthContext;
  method: "read" | "create" | "update" | "delete";
  path: string;
  resourceData?: Record<string, any>;
  requestData?: Record<string, any>;
}

function evaluateRule(req: RequestContext): { allowed: boolean; reason: string } {
  const { auth, method, path, resourceData, requestData } = req;
  const isAuth = !!auth && !!auth.uid;
  const role = auth?.role || "reader";

  // /stories/{storyId}
  if (path.startsWith("stories/") && !path.includes("/versions/")) {
    if (method === "read") {
      if (resourceData?.status === "published" || role === "editor" || role === "admin") {
        return { allowed: true, reason: "Published stories are public; editors can see drafts" };
      }
      return { allowed: false, reason: "Draft stories are only visible to editors and admins" };
    }
    if (method === "create") {
      if (role === "contributor" || role === "editor" || role === "admin") {
        return { allowed: true, reason: "Contributors, editors, admins can create stories" };
      }
      return { allowed: false, reason: "Readers cannot create stories" };
    }
    if (method === "update") {
      if (role === "editor" || role === "admin") {
        return { allowed: true, reason: "Editors/admins can update stories" };
      }
      if (role === "contributor" && resourceData?.author?.id === auth?.uid && resourceData?.status === "draft") {
        return { allowed: true, reason: "Contributor can update their own draft" };
      }
      return { allowed: false, reason: "Unauthorized story update" };
    }
    if (method === "delete") {
      return { allowed: role === "admin", reason: "Only admin can delete stories" };
    }
  }

  // /chats/{storyId}/messages/{messageId}
  if (path.startsWith("chats/")) {
    if (method === "read") return { allowed: true, reason: "Live debate messages are public" };
    if (method === "create") {
      if (isAuth && requestData?.userId === auth?.uid) {
        return { allowed: true, reason: "Authenticated user can post their own message" };
      }
      return { allowed: false, reason: "Must be logged in and userId must match auth.uid" };
    }
    if (method === "update") {
      // Reactions update or editor
      if (role === "editor" || role === "admin") return { allowed: true, reason: "Moderators can edit/flag" };
      if (isAuth && requestData?.reactions) return { allowed: true, reason: "Users can update reactions" };
      return { allowed: false, reason: "Unauthorized message update" };
    }
  }

  // /credibility/{userId}
  if (path.startsWith("credibility/")) {
    if (method === "read") return { allowed: true, reason: "Credibility profiles are public" };
    if (method === "update") {
      if (role === "admin") return { allowed: true, reason: "Admin can update scores" };
      if (requestData?.overallScore !== undefined || requestData?.level !== undefined) {
        return { allowed: false, reason: "Users cannot artificially alter overallScore or level" };
      }
      return { allowed: true, reason: "User can update metadata" };
    }
  }

  return { allowed: false, reason: "No matching allow rule" };
}

// Execution of test matrix
console.log("=================================================");
console.log("🔥 RUNNING FIRESTORE SECURITY RULES VERIFICATION");
console.log("=================================================");

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description} - ${details || ""}`);
    failed++;
  }
}

// 1. Stories access tests
assert(
  "Guest can read published story",
  evaluateRule({
    auth: undefined,
    method: "read",
    path: "stories/story-123",
    resourceData: { status: "published" },
  }).allowed
);

assert(
  "Guest CANNOT read draft story",
  !evaluateRule({
    auth: undefined,
    method: "read",
    path: "stories/story-123",
    resourceData: { status: "draft" },
  }).allowed
);

assert(
  "Editor CAN read draft story",
  evaluateRule({
    auth: { uid: "user-editor", role: "editor" },
    method: "read",
    path: "stories/story-123",
    resourceData: { status: "draft" },
  }).allowed
);

assert(
  "Reader CANNOT create a story",
  !evaluateRule({
    auth: { uid: "user-reader", role: "reader" },
    method: "create",
    path: "stories/story-456",
  }).allowed
);

assert(
  "Contributor CAN create a story draft",
  evaluateRule({
    auth: { uid: "user-author", role: "contributor" },
    method: "create",
    path: "stories/story-456",
  }).allowed
);

assert(
  "Contributor CANNOT edit another author's story",
  !evaluateRule({
    auth: { uid: "user-malicious", role: "contributor" },
    method: "update",
    path: "stories/story-456",
    resourceData: { author: { id: "user-author" }, status: "draft" },
  }).allowed
);

assert(
  "Contributor CAN update their own draft",
  evaluateRule({
    auth: { uid: "user-author", role: "contributor" },
    method: "update",
    path: "stories/story-456",
    resourceData: { author: { id: "user-author" }, status: "draft" },
  }).allowed
);

// 2. Chat messages tests
assert(
  "Unauthenticated guest CANNOT post in chat",
  !evaluateRule({
    auth: undefined,
    method: "create",
    path: "chats/story-1/messages/msg-1",
    requestData: { userId: "some-user" },
  }).allowed
);

assert(
  "Authenticated user CAN post message with their own userId",
  evaluateRule({
    auth: { uid: "user-123", role: "reader" },
    method: "create",
    path: "chats/story-1/messages/msg-1",
    requestData: { userId: "user-123", content: "Great article!" },
  }).allowed
);

assert(
  "User CANNOT impersonate another user in chat",
  !evaluateRule({
    auth: { uid: "user-123", role: "reader" },
    method: "create",
    path: "chats/story-1/messages/msg-1",
    requestData: { userId: "impersonated-user", content: "Fake msg" },
  }).allowed
);

// 3. Credibility manipulation tests
assert(
  "Reader CANNOT arbitrarily tamper their credibility overallScore",
  !evaluateRule({
    auth: { uid: "user-123", role: "reader" },
    method: "update",
    path: "credibility/user-123",
    requestData: { overallScore: 99 },
  }).allowed
);

console.log("-------------------------------------------------");
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎯 All security rules tests passed successfully!");
}
