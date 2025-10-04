-- Create storage bucket for coursework files
INSERT INTO storage.buckets (id, name, public)
VALUES ('coursework', 'coursework', false);

-- RLS policies for coursework bucket
CREATE POLICY "Users can upload their own coursework"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'coursework' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own coursework"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'coursework' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own coursework"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'coursework' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );