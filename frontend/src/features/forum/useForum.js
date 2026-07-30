import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forumClient } from '@/api/forumClient';

export const usePosts = (params = {}) =>
  useQuery({
    queryKey: ['forums', 'posts', params],
    queryFn: () => forumClient.getPosts(params),
  });

export const usePost = (id) =>
  useQuery({
    queryKey: ['forums', 'post', id],
    queryFn: () => forumClient.getPost(id),
    enabled: !!id,
  });

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: forumClient.createPost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forums', 'posts'] }),
  });
};

export const useComments = (postId) =>
  useQuery({
    queryKey: ['forums', 'comments', postId],
    queryFn: () => forumClient.getComments(postId),
    enabled: !!postId,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });

export const useCreateComment = (postId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => forumClient.createComment(postId, payload),
    onMutate: async (payload) => {
      // Optimistic update
      await qc.cancelQueries({ queryKey: ['forums', 'comments', postId] });
      const previous = qc.getQueryData(['forums', 'comments', postId]);
      qc.setQueryData(['forums', 'comments', postId], (old) => {
        const comment = { _id: Date.now(), content: payload.content, createdAt: new Date().toISOString(), isOptimistic: true };
        return old ? [...old, comment] : [comment];
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(['forums', 'comments', postId], ctx.previous);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['forums', 'comments', postId] }),
  });
};

export const useUpvote = (postId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => forumClient.upvote(postId),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['forums', 'post', postId] });
      const previous = qc.getQueryData(['forums', 'post', postId]);
      qc.setQueryData(['forums', 'post', postId], (old) =>
        old ? { ...old, upvotes: (old.upvotes || 0) + 1 } : old
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['forums', 'post', postId], ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['forums', 'post', postId] }),
  });
};
